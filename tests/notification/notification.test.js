jest.mock("../../config/db", () => require("../helpers/prismaMock"));

const request = require("supertest");
const app = require("../../src/app");
const prisma = require("../../config/db");
const tokenFor = require("../helpers/token");

describe("Notification routes", () => {
  beforeEach(() => jest.clearAllMocks());

  test("GET /api/notifications returns the authenticated user's notifications", async () => {
    const notifications = [{ id: "notification-1", isRead: false }];
    prisma.notification.findMany.mockResolvedValue(notifications);

    const response = await request(app)
      .get("/api/notifications")
      .set("Authorization", `Bearer ${tokenFor()}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: "success", data: notifications });
    expect(prisma.notification.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "route-test-user" } }),
    );
  });

  test("PATCH /api/notifications/:id/read marks an unread notification as read", async () => {
    prisma.notification.findUnique.mockResolvedValue({
      id: "notification-1",
      isRead: false,
    });
    prisma.notification.update.mockResolvedValue({});

    const response = await request(app)
      .patch("/api/notifications/notification-1/read")
      .set("Authorization", `Bearer ${tokenFor()}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Notification marked as read");
    expect(prisma.notification.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { isRead: true } }),
    );
  });

  test("PATCH /api/notifications/read-all marks all user notifications as read", async () => {
    prisma.notification.updateMany.mockResolvedValue({ count: 2 });

    const response = await request(app)
      .patch("/api/notifications/read-all")
      .set("Authorization", `Bearer ${tokenFor()}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("All notifications marked as read");
    expect(prisma.notification.updateMany).toHaveBeenCalledWith({
      where: { userId: "route-test-user" },
      data: { isRead: true },
    });
  });
});
