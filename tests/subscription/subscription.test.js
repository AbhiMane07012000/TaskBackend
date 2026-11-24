jest.mock("../../config/db", () => require("../helpers/prismaMock"));
jest.mock("../../config/razorpay", () => ({
  orders: { create: jest.fn() },
}));

const request = require("supertest");
const app = require("../../src/app");
const prisma = require("../../config/db");
const razorpay = require("../../config/razorpay");
const tokenFor = require("../helpers/token");

describe("Subscription routes", () => {
  beforeEach(() => jest.clearAllMocks());

  test("POST /api/subscriptions/create-order creates a payment order for a paid plan", async () => {
    prisma.plan.findUnique.mockResolvedValue({
      id: "plan-1",
      name: "PRO",
      price: 25.5,
    });
    razorpay.orders.create.mockResolvedValue({
      id: "order-1",
      amount: 2550,
      currency: "INR",
    });

    const response = await request(app)
      .post("/api/subscriptions/create-order")
      .set("Authorization", `Bearer ${tokenFor()}`)
      .send({ planId: "plan-1" });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      status: "success",
      message: "Order created successfully",
      data: {
        orderId: "order-1",
        amount: 2550,
        currency: "INR",
        plan: "PRO",
      },
    });
    expect(razorpay.orders.create).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 2550,
        currency: "INR",
        notes: { userId: "route-test-user", planId: "plan-1" },
      }),
    );
  });

  test("POST /api/subscriptions/create-order rejects a missing plan ID", async () => {
    const response = await request(app)
      .post("/api/subscriptions/create-order")
      .set("Authorization", `Bearer ${tokenFor()}`)
      .send({});

    expect(response.statusCode).toBe(400);
    expect(razorpay.orders.create).not.toHaveBeenCalled();
  });
});
