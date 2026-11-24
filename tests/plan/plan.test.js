jest.mock("../../config/db", () => require("../helpers/prismaMock"));

const request = require("supertest");
const app = require("../../src/app");
const prisma = require("../../config/db");

describe("Plan routes", () => {
  beforeEach(() => jest.clearAllMocks());

  test("GET /api/plans returns active plans without requiring authentication", async () => {
    const plans = [{ id: "plan-1", name: "PRO", price: 100 }];
    prisma.plan.findMany.mockResolvedValue(plans);

    const response = await request(app).get("/api/plans");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: "success", data: plans });
    expect(prisma.plan.findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      orderBy: { price: "asc" },
    });
  });
});
