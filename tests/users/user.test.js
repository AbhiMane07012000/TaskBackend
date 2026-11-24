
const request = require("supertest");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = require("../../src/app");
const prisma = require("../../config/db");

describe("User API", () => {
  let user;
  let admin;
  let superAdmin;

  let userToken;
  let adminToken;
  let superAdminToken;

  beforeAll(async () => {
    process.env.JWT_SECRET = "test-access-secret";

    const hashedPassword = await bcrypt.hash("Password@123", 10);

    const createTestUser = async (username, email, role) => {
      return prisma.user.upsert({
        where: { email },
        update: {
          username,
          password: hashedPassword,
          role,
        },
        create: {
          username,
          email,
          password: hashedPassword,
          role,
        },
      });
    };

    user = await createTestUser(
      "userTest",
      "user-test@example.com",
      "USER"
    );

    admin = await createTestUser(
      "adminTest",
      "admin-test@example.com",
      "ADMIN"
    );

    superAdmin = await createTestUser(
      "superAdminTest",
      "superadmin-test@example.com",
      "SUPER_ADMIN"
    );

    const generateToken = (account) =>
      jwt.sign(
        {
          id: account.id,
          role: account.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

    userToken = generateToken(user);
    adminToken = generateToken(admin);
    superAdminToken = generateToken(superAdmin);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [
            "user-test@example.com",
            "admin-test@example.com",
            "superadmin-test@example.com",
            "new-user-test@example.com",
            "updated-user-test@example.com",
          ],
        },
      },
    });

    await prisma.$disconnect();
  });

  // GET USERS
  describe("GET /api/users", () => {
    test("should return 200 for SUPER_ADMIN", async () => {
      const response = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("meta");
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test.each([
      ["USER", () => userToken],
      ["ADMIN", () => adminToken],
    ])("should return 403 for %s", async (role, getToken) => {
      const response = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${getToken()}`);

      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe("Super Admin access required");
    });

    test("should return 401 when token is missing", async () => {
      const response = await request(app).get("/api/users");

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("No token provided");
    });

    test("should return 401 when token is invalid", async () => {
      const response = await request(app)
        .get("/api/users")
        .set("Authorization", "Bearer invalid-token");

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("Invalid token");
    });

    test("should support pagination", async () => {
      const response = await request(app)
        .get("/api/users?page=1&limit=1")
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.data.length).toBeLessThanOrEqual(1);
      expect(response.body.meta.page).toBe(1);
      expect(response.body.meta.limit).toBe(1);
    });

    test("should support username search", async () => {
      const response = await request(app)
        .get("/api/users?search=userTest")
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);

      expect(
        response.body.data.some((item) => item.username === "userTest")
      ).toBe(true);
    });

    test("should return 404 when search has no matching users", async () => {
      const response = await request(app)
        .get("/api/users?search=unknown-user-xyz")
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe("No users found");
    });
  });

  // PATCH USER
  describe("PATCH /api/users/:id", () => {
    const email = "new-user-test@example.com";

    let targetUser;

    beforeAll(async () => {
      await prisma.user.deleteMany({
        where: { email: "updated-user-test@example.com" },
      });

      targetUser = await prisma.user.upsert({
        where: { email },
        update: {
          username: "newUserTest",
          password: await bcrypt.hash("Password@123", 10),
          role: "USER",
        },
        create: {
          username: "newUserTest",
          email,
          password: await bcrypt.hash("Password@123", 10),
          role: "USER",
        },
      });
    });

    test("should update user successfully", async () => {
      const response = await request(app)
        .patch(`/api/users/${targetUser.id}`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({
          name: "UpdatedUser",
          email: "updated-user-test@example.com",
          role: "ADMIN",
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("User updated successfully");

      const updatedUser = await prisma.user.findUnique({
        where: { id: targetUser.id },
      });

      expect(updatedUser.username).toBe("UpdatedUser");
      expect(updatedUser.email).toBe("updated-user-test@example.com");
      expect(updatedUser.role).toBe("ADMIN");
    });

    test("should return 400 for invalid role", async () => {
      const response = await request(app)
        .patch(`/api/users/${targetUser.id}`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({
          name: "UpdatedUser",
          email: "updated-user-test@example.com",
          role: "SUPER_ADMIN",
        });

      expect(response.statusCode).toBe(400);
    });

    test("should return 404 when user does not exist", async () => {
      const response = await request(app)
        .patch("/api/users/non-existing-id")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({
          name: "UpdatedUser",
          email: "updated-user-test@example.com",
          role: "USER",
        });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe("User not found");
    });

    test("should return 403 for ADMIN", async () => {
      const response = await request(app)
        .patch(`/api/users/${targetUser.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "UpdatedUser",
          email: "updated-user-test@example.com",
          role: "USER",
        });

      expect(response.statusCode).toBe(403);
    });
  });

  // CHANGE USER PASSWORD
  describe("PUT /api/users/:id/password", () => {
    test("should update password successfully", async () => {
      const newPassword = "NewPassword@123";

      const response = await request(app)
        .put(`/api/users/${user.id}/password`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({
          newPassword,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Password updated successfully");

      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      const isPasswordValid = await bcrypt.compare(
        newPassword,
        updatedUser.password
      );

      expect(isPasswordValid).toBe(true);
    });

    test("should return 400 when password is missing", async () => {
      const response = await request(app)
        .put(`/api/users/${user.id}/password`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("New password is required");
    });

    test("should return 404 when user does not exist", async () => {
      const response = await request(app)
        .put("/api/users/non-existing-id/password")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({
          newPassword: "NewPassword@123",
        });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe("User not found");
    });

    test("should return 403 for ADMIN", async () => {
      const response = await request(app)
        .put(`/api/users/${user.id}/password`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          newPassword: "NewPassword@123",
        });

      expect(response.statusCode).toBe(403);
    });

    test("should return 401 without token", async () => {
      const response = await request(app)
        .put(`/api/users/${user.id}/password`)
        .send({
          newPassword: "NewPassword@123",
        });

      expect(response.statusCode).toBe(401);
    });
  });
});
