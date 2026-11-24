jest.mock("../../config/db", () => require("../helpers/prismaMock"));
jest.mock("../../middlewares/upload.middleware", () => ({
  uploadSingle: () => (req, res, next) => next(),
}));
jest.mock("../../config/cloudinary", () => ({
  uploader: { destroy: jest.fn() },
}));
jest.mock("../../src/notification/notification.service", () => ({
  createNotification: jest.fn(),
}));

const request = require("supertest");
const app = require("../../src/app");
const prisma = require("../../config/db");
const { createNotification } = require("../../src/notification/notification.service");
const tokenFor = require("../helpers/token");

describe("Comment routes", () => {
  beforeEach(() => jest.clearAllMocks());

  test("POST /api/comments creates a comment", async () => {
    const comment = { id: "comment-1", content: "Looks good" };
    prisma.comment.create.mockResolvedValue(comment);

    const response = await request(app)
      .post("/api/comments")
      .set("Authorization", `Bearer ${tokenFor()}`)
      .send({ content: "Looks good", taskId: "task-1" });

    expect(response.statusCode).toBe(201);
    expect(response.body.comment).toEqual(comment);
    expect(prisma.comment.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        content: "Looks good",
        taskId: "task-1",
        createdById: "route-test-user",
      }),
    });
  });

  test("POST /api/comments validates mentioned users are assigned to the task", async () => {
    prisma.user.findUnique.mockResolvedValue({ id: "user-2" });
    prisma.taskUser.findFirst.mockResolvedValue({ taskId: "task-1", userId: "user-2" });
    prisma.comment.create.mockResolvedValue({ id: "comment-1" });

    const response = await request(app)
      .post("/api/comments")
      .set("Authorization", `Bearer ${tokenFor()}`)
      .send({ content: "Thanks @user2", taskId: "task-1" });

    expect(response.statusCode).toBe(201);
    expect(prisma.taskUser.findFirst).toHaveBeenCalledWith({
      where: { taskId: "task-1", userId: "user-2" },
    });
    expect(createNotification).toHaveBeenCalledWith(
      "user-2",
      "TASK_COMMENT_MENTION",
      'You were mentioned in a comment: "Thanks @user2"',
    );
  });

  test("PATCH /api/comments/:id updates a comment owned by the user", async () => {
    prisma.comment.findUnique.mockResolvedValue({
      id: "comment-1",
      createdById: "route-test-user",
    });
    prisma.comment.update.mockResolvedValue({
      id: "comment-1",
      content: "Updated",
    });

    const response = await request(app)
      .patch("/api/comments/comment-1")
      .set("Authorization", `Bearer ${tokenFor()}`)
      .send({ content: "Updated" });

    expect(response.statusCode).toBe(200);
    expect(response.body.comment.content).toBe("Updated");
  });

  test("DELETE /api/comments/:id deletes a comment owned by the user", async () => {
    prisma.comment.findUnique.mockResolvedValue({
      id: "comment-1",
      createdById: "route-test-user",
      imagePublicId: null,
    });
    prisma.comment.delete.mockResolvedValue({});

    const response = await request(app)
      .delete("/api/comments/comment-1")
      .set("Authorization", `Bearer ${tokenFor()}`);

    expect(response.statusCode).toBe(204);
    expect(prisma.comment.delete).toHaveBeenCalledWith({
      where: { id: "comment-1" },
    });
  });
});
