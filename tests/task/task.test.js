jest.mock("../../config/db", () => require("../helpers/prismaMock"));
jest.mock("../../config/ai", () => ({ generateContent: jest.fn() }));
jest.mock("../../utils/mailer", () => ({ sendEmail: jest.fn() }));
jest.mock("../../src/notification/notification.service", () => ({
  createNotification: jest.fn(),
}));

const request = require("supertest");
const app = require("../../src/app");
const prisma = require("../../config/db");
const { generateContent } = require("../../config/ai");
const { createNotification } = require("../../src/notification/notification.service");
const tokenFor = require("../helpers/token");

describe("Task routes", () => {
  beforeEach(() => jest.clearAllMocks());

  test("POST /api/tasks creates a task for an authorized admin", async () => {
    prisma.project.findUnique.mockResolvedValue({
      id: "project-1",
      createdById: "route-test-user",
    });
    prisma.task.create.mockResolvedValue({ id: "task-1", title: "Test task" });

    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${tokenFor("ADMIN")}`)
      .send({
        title: "Test task",
        description: "Task description",
        projectId: "project-1",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.id).toBe("task-1");
  });

  test("POST /api/tasks allows an authorized project member to create a task", async () => {
    prisma.project.findUnique.mockResolvedValue({
      id: "project-1",
      createdById: "project-owner",
    });
    prisma.projectUser.findUnique.mockResolvedValue({
      projectId: "project-1",
      userId: "route-test-user",
    });
    prisma.task.create.mockResolvedValue({ id: "task-1", title: "Test task" });

    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${tokenFor("SUPER_ADMIN")}`)
      .send({
        title: "Test task",
        description: "Task description",
        projectId: "project-1",
      });

    expect(response.statusCode).toBe(201);
    expect(prisma.projectUser.findUnique).toHaveBeenCalledWith({
      where: {
        projectId_userId: {
          projectId: "project-1",
          userId: "route-test-user",
        },
      },
    });
  });

  test("GET /api/tasks lists tasks", async () => {
    prisma.task.findMany.mockResolvedValue([{ id: "task-1" }]);

    const response = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${tokenFor()}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([{ id: "task-1" }]);
  });

  test("GET /api/tasks/:id returns a task owned by the user", async () => {
    prisma.task.findUnique.mockResolvedValue({
      id: "task-1",
      createdById: "route-test-user",
    });

    const response = await request(app)
      .get("/api/tasks/task-1")
      .set("Authorization", `Bearer ${tokenFor()}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe("task-1");
  });

  test("PATCH /api/tasks/:id updates a task", async () => {
    prisma.task.findUnique.mockResolvedValue({ id: "task-1", status: "PENDING" });
    prisma.task.update.mockResolvedValue({ id: "task-1", title: "Changed" });

    const response = await request(app)
      .patch("/api/tasks/task-1")
      .set("Authorization", `Bearer ${tokenFor()}`)
      .send({ title: "Changed" });

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Changed");
  });

  test("PATCH /api/tasks/:id notifies assignees when status changes", async () => {
    prisma.task.findUnique.mockResolvedValue({ id: "task-1", status: "PENDING" });
    prisma.task.update.mockResolvedValue({ id: "task-1", title: "Test task" });
    prisma.taskUser.findMany.mockResolvedValue([{ userId: "user-2" }]);

    const response = await request(app)
      .patch("/api/tasks/task-1")
      .set("Authorization", `Bearer ${tokenFor()}`)
      .send({ status: "COMPLETED" });

    expect(response.statusCode).toBe(200);
    expect(prisma.taskUser.findMany).toHaveBeenCalledWith({
      where: { taskId: "task-1" },
    });
    expect(createNotification).toHaveBeenCalledWith(
      "user-2",
      "TASK_UPDATED",
      'Task "Test task" status has been updated.',
    );
  });

  test("DELETE /api/tasks/:id deletes a task for a super admin", async () => {
    prisma.task.findUnique.mockResolvedValue({
      id: "task-1",
      createdById: "route-test-user",
    });
    prisma.task.delete.mockResolvedValue({});

    const response = await request(app)
      .delete("/api/tasks/task-1")
      .set("Authorization", `Bearer ${tokenFor("SUPER_ADMIN")}`);

    expect(response.statusCode).toBe(204);
    expect(prisma.task.delete).toHaveBeenCalledWith({
      where: { id: "task-1" },
    });
  });

  test("PATCH /api/tasks/:id/assign assigns a user", async () => {
    prisma.task.findUnique.mockResolvedValue({ id: "task-1", title: "Test task" });
    prisma.user.findUnique.mockResolvedValue({
      id: "user-2",
      email: "user@example.com",
      username: "user2",
    });
    prisma.taskUser.findUnique.mockResolvedValue(null);
    prisma.taskUser.create.mockResolvedValue({});

    const response = await request(app)
      .patch("/api/tasks/task-1/assign")
      .set("Authorization", `Bearer ${tokenFor("ADMIN")}`)
      .send({ userId: "user-2" });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("User assigned to task successfully.");
  });

  test("DELETE /api/tasks/:id/remove removes an assigned user", async () => {
    prisma.task.findUnique.mockResolvedValue({ id: "task-1" });
    prisma.user.findUnique.mockResolvedValue({ id: "user-2" });
    prisma.taskUser.findUnique.mockResolvedValue({ taskId: "task-1", userId: "user-2" });
    prisma.taskUser.delete.mockResolvedValue({});

    const response = await request(app)
      .delete("/api/tasks/task-1/remove")
      .set("Authorization", `Bearer ${tokenFor("ADMIN")}`)
      .send({ userId: "user-2" });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("User removed from task successfully");
  });

  test("GET /api/tasks/:id/assignees returns assigned users", async () => {
    prisma.task.findUnique.mockResolvedValue({ id: "task-1" });
    prisma.taskUser.findMany.mockResolvedValue([
      { user: { id: "user-2", username: "user2", email: "user@example.com", role: "USER" } },
    ]);

    const response = await request(app)
      .get("/api/tasks/task-1/assignees")
      .set("Authorization", `Bearer ${tokenFor()}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(prisma.taskUser.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: {
          user: {
            select: expect.objectContaining({ username: true }),
          },
        },
      }),
    );
  });

  test("GET /api/tasks/:id/comments returns task comments", async () => {
    prisma.comment.findMany.mockResolvedValue([{ id: "comment-1", content: "Comment" }]);

    const response = await request(app)
      .get("/api/tasks/task-1/comments")
      .set("Authorization", `Bearer ${tokenFor()}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqual([{ id: "comment-1", content: "Comment" }]);
  });

  test("GET /api/tasks/:id/summary summarizes task comments", async () => {
    prisma.comment.findMany.mockResolvedValue([{ content: "Comment" }]);
    generateContent.mockResolvedValue("A short summary");

    const response = await request(app)
      .get("/api/tasks/task-1/summary")
      .set("Authorization", `Bearer ${tokenFor()}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ success: true, data: "A short summary" });
  });
});
