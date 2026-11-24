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
const tokenFor = require("../helpers/token");

describe("Project routes", () => {
  beforeEach(() => jest.clearAllMocks());

  test("POST /api/projects creates a project for a super admin", async () => {
    prisma.project.create.mockResolvedValue({ id: "project-1", name: "Project" });

    const response = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${tokenFor("SUPER_ADMIN")}`)
      .send({ name: "Project", description: "A project" });

    expect(response.statusCode).toBe(201);
    expect(response.body.id).toBe("project-1");
  });

  test("GET /api/projects lists projects", async () => {
    prisma.project.findMany.mockResolvedValue([{ id: "project-1" }]);

    const response = await request(app)
      .get("/api/projects")
      .set("Authorization", `Bearer ${tokenFor()}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([{ id: "project-1" }]);
  });

  test("GET /api/projects/:id returns a project owned by the user", async () => {
    prisma.project.findUnique.mockResolvedValue({
      id: "project-1",
      createdById: "route-test-user",
    });

    const response = await request(app)
      .get("/api/projects/project-1")
      .set("Authorization", `Bearer ${tokenFor()}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe("project-1");
  });

  test("PATCH /api/projects/:id updates a project for an admin", async () => {
    prisma.project.findUnique.mockResolvedValue({ id: "project-1", createdById: "someone-else" });
    prisma.project.update.mockResolvedValue({ id: "project-1", name: "Updated" });

    const response = await request(app)
      .patch("/api/projects/project-1")
      .set("Authorization", `Bearer ${tokenFor("ADMIN")}`)
      .send({ name: "Updated" });

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe("Updated");
  });

  test("DELETE /api/projects/:id deletes a project for a super admin", async () => {
    prisma.project.findUnique.mockResolvedValue({
      id: "project-1",
      createdById: "route-test-user",
    });
    prisma.project.delete.mockResolvedValue({});

    const response = await request(app)
      .delete("/api/projects/project-1")
      .set("Authorization", `Bearer ${tokenFor("SUPER_ADMIN")}`);

    expect(response.statusCode).toBe(204);
    expect(prisma.project.delete).toHaveBeenCalledWith({
      where: { id: "project-1" },
    });
  });

  test("GET /api/projects/:id/users returns project users", async () => {
    prisma.project.findUnique.mockResolvedValue({
      id: "project-1",
      createdById: "route-test-user",
    });
    prisma.projectUser.findMany.mockResolvedValue([
      { user: { id: "user-2", username: "user2" } },
    ]);

    const response = await request(app)
      .get("/api/projects/project-1/users")
      .set("Authorization", `Bearer ${tokenFor()}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([{ id: "user-2", username: "user2" }]);
    expect(prisma.projectUser.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: {
          user: {
            select: expect.objectContaining({ username: true }),
          },
        },
      }),
    );
  });

  test("POST /api/projects/:id/users adds a user to a project", async () => {
    prisma.project.findUnique.mockResolvedValue({
      id: "project-1",
      name: "Project",
      createdById: "route-test-user",
    });
    prisma.user.findUnique.mockResolvedValue({
      id: "user-2",
      email: "user@example.com",
      username: "user2",
    });
    prisma.projectUser.findUnique.mockResolvedValue(null);
    prisma.projectUser.create.mockResolvedValue({});

    const response = await request(app)
      .post("/api/projects/project-1/users")
      .set("Authorization", `Bearer ${tokenFor("ADMIN")}`)
      .send({ userId: "user-2" });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("User added to project successfully.");
  });

  test("DELETE /api/projects/:id/users removes a user from a project", async () => {
    prisma.project.findUnique.mockResolvedValue({ id: "project-1" });
    prisma.user.findUnique.mockResolvedValue({ id: "user-2" });
    prisma.projectUser.findUnique.mockResolvedValue({ projectId: "project-1", userId: "user-2" });
    prisma.projectUser.delete.mockResolvedValue({});

    const response = await request(app)
      .delete("/api/projects/project-1/users")
      .set("Authorization", `Bearer ${tokenFor("ADMIN")}`)
      .send({ userId: "user-2" });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("User removed from project successfully.");
  });

  test("GET /api/projects/:id/tasks/suggestions returns generated suggestions", async () => {
    prisma.project.findUnique.mockResolvedValue({
      id: "project-1",
      description: "A project description",
    });
    generateContent.mockResolvedValue("Suggested tasks");

    const response = await request(app)
      .get("/api/projects/project-1/tasks/suggestions")
      .set("Authorization", `Bearer ${tokenFor("ADMIN")}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: "success", data: "Suggested tasks" });
  });
});
