jest.mock("../../config/db", () => require("../helpers/prismaMock"));

const request = require("supertest");
const app = require("../../src/app");
const prisma = require("../../config/db");
const tokenFor = require("../helpers/token");

describe("Dashboard routes", () => {
  beforeEach(() => jest.clearAllMocks());

  test("GET /api/dashboard returns aggregate data to an authenticated user", async () => {
    prisma.user.count.mockResolvedValue(4);
    prisma.project.count.mockResolvedValue(2);
    prisma.task.count.mockResolvedValue(7);
    prisma.task.groupBy.mockResolvedValue([
      { status: "PENDING", _count: { status: 3 } },
      { status: "COMPLETED", _count: { status: 4 } },
    ]);
    prisma.user.groupBy.mockResolvedValue([
      { role: "USER", _count: { role: 3 } },
      { role: "ADMIN", _count: { role: 1 } },
    ]);

    const response = await request(app)
      .get("/api/dashboard")
      .set("Authorization", `Bearer ${tokenFor()}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      totalUsers: 4,
      totalProjects: 2,
      totalTasks: 7,
      taskStatusCount: { PENDING: 3, COMPLETED: 4 },
      userRoleCount: { USER: 3, ADMIN: 1 },
    });
  });
});
