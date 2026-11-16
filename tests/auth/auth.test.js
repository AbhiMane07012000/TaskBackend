const request = require("supertest");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = require("../../src/app");
const prisma = require("../../config/db");
const { sendEmail } = require("../../utils/mailer");

jest.mock("../../utils/mailer", () => ({
  sendEmail: jest.fn().mockResolvedValue({
    messageId: "test-message-id",
  }),
}));

describe("Auth API", () => {
  beforeAll(async () => {
    process.env.JWT_SECRET = "test-access-secret";
    process.env.JWT_REFRESH_SECRET = "test-refresh-secret";

    const hashedPassword = await bcrypt.hash("Password@123", 10);

    await prisma.user.deleteMany({
      where: {
        email: {
          in: ["user@test.com", "admin@test.com", "superadmin@test.com"],
        },
      },
    });

    await prisma.user.createMany({
      data: [
        {
          username: "testUser",
          email: "user@test.com",
          password: hashedPassword,
          role: "USER",
        },
        {
          username: "testAdmin",
          email: "admin@test.com",
          password: hashedPassword,
          role: "ADMIN",
        },
        {
          username: "testSuperAdmin",
          email: "superadmin@test.com",
          password: hashedPassword,
          role: "SUPER_ADMIN",
        },
      ],
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ["user@test.com", "admin@test.com", "superadmin@test.com"],
        },
      },
    });

    await prisma.$disconnect();
  });

  //Login API
  describe("POST /api/auth/login", () => {
    test.each([
      ["USER", "user@test.com"],
      ["ADMIN", "admin@test.com"],
      ["SUPER_ADMIN", "superadmin@test.com"],
    ])("should login successfully as %s", async (role, email) => {
      const response = await request(app).post("/api/auth/login").send({
        email,
        password: "Password@123",
      });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("accessToken");
      expect(response.headers["set-cookie"]).toBeDefined();
    });

    test("should return 400 when Email Missing", async () => {
      const response = await request(app).post("/api/auth/login").send({
        password: "Password@123",
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Email is required");
    });

    test("should return 400 when password Missing", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "user@test.com",
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Password is required");
    });

    test("should return 401 when Email is wrong", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "Password@123",
      });

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("Invalid credentials");
    });

    test("should return 401 when Password is wrong", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "user@test.com",
        password: "WrongPassword@123",
      });

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("Invalid credentials");
    });
  });

  //Register API
  describe("POST /api/auth/register", () => {
    const testEmail = "register-test@example.com";

    beforeEach(async () => {
      const existingUser = await prisma.user.findUnique({
        where: { email: testEmail },
      });

      if (existingUser) {
        await prisma.subscription.deleteMany({
          where: { userID: existingUser.id },
        });

        await prisma.user.delete({
          where: { id: existingUser.id },
        });
      }
    });

    afterAll(async () => {
      const user = await prisma.user.findUnique({
        where: { email: testEmail },
      });

      if (user) {
        await prisma.subscription.deleteMany({
          where: { userID: user.id },
        });

        await prisma.user.delete({
          where: { id: user.id },
        });
      }
    });

    test("Should user register Successfully as USER Role", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: "registerUser",
        email: testEmail,
        password: "Password@123",
        role: "USER",
      });

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe("User created");
      expect(response.body.data).toHaveProperty("UserId");

      const user = await prisma.user.findUnique({
        where: {
          email: testEmail,
        },
      });

      expect(user).not.toBeNull();
      expect(user.username).toBe("registerUser");
      expect(user.role).toBe("USER");

      const isPassWordValid = await bcrypt.compare(
        "Password@123",
        user.password,
      );

      expect(isPassWordValid).toBe(true);

      const subscription = await prisma.subscription.findFirst({
        where: {
          userID: user.id,
        },
      });

      expect(subscription).not.toBeNull();
      expect(subscription.status).toBe("ACTIVE");
    });

    test("should return 400 when email is missing", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: "registerUser",
        password: "Password@123",
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Email is required");
    });

    test("should return 400 when password is missing", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: "registerUser",
        email: testEmail,
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Password is required");
    });

    test("Should return 409 when email is reused", async () => {
      await prisma.user.create({
        data: {
          username: "existingUser",
          email: testEmail,
          password: "Password@123",
          role: "ADMIN",
        },
      });

      const response = await request(app).post("/api/auth/register").send({
        username: "newUser",
        email: testEmail,
        password: "Password@123",
        role: "ADMIN",
      });

      expect(response.statusCode).toBe(409);
      expect(response.body.message).toBe("Email already in use");
    });

    test("Should register with ADMIN ROLE", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: "adminUser",
        email: testEmail,
        password: "Password@123",
        role: "ADMIN",
      });

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe("User created");
      expect(response.body.data).toHaveProperty("UserId");

      const user = await prisma.user.findUnique({
        where: {
          email: testEmail,
        },
      });

      expect(user.role).toBe("ADMIN");
    });

    test("Should not be register as SUPER_ADMIN gets 400", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: "superAdminUser",
        email: testEmail,
        password: "Password@123",
        role: "SUPER_ADMIN",
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Invalid Role.");
    });

    test("Should Mail triggered after user creation", async () => {
      sendEmail.mockClear();

      const response = await request(app).post("/api/auth/register").send({
        username: "User",
        email: testEmail,
        password: "Password@123",
        role: "USER",
      });

      expect(response.statusCode).toBe(201);

      expect(sendEmail).toHaveBeenCalledTimes(1);

      expect(sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: testEmail,
          subject: "Welcome to TaskFlow!",
          text: expect.stringContaining("welcome to TaskFlow"),
          html: expect.stringContaining("excited to have you on board"),
        }),
      );
    });
  });

  //Me API
  describe("GET /api/auth/me", () => {
    let accessToken;

    beforeAll(async () => {
      const loginRes = await request(app).post("/api/auth/login").send({
        email: "user@test.com",
        password: "Password@123",
      });

      accessToken = loginRes.body.accessToken;
    });

    test("Should return Valid User Details", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("user");

      expect(response.body.user).toEqual(
        expect.objectContaining({
          id: expect.anything(),
          username: "testUser",
          role: "USER",
          email: "user@test.com",
        }),
      );

      expect(response.body.user).not.toHaveProperty("password");
    });

    test("Should be 401 for token is not provided", async () => {
      const response = await request(app).get("/api/auth/me");

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("No token provided");
    });

    test("Should be 401 for token is not valid", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${accessToken}|`);

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("Invalid token");
    });

    test("Should be 404 when user not found", async () => {
      const loginResponse = await request(app).post("/api/auth/login").send({
        email: "user@test.com",
        password: "Password@123",
      });

      let token = loginResponse.body.accessToken;

      await prisma.user.delete({
        where: {
          email: "user@test.com",
        },
      });

      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe("User not found");

      await prisma.user.create({
        data: {
          username: "testUser",
          email: "user@test.com",
          password: await bcrypt.hash("Password@123", 10),
          role: "USER",
        },
      });
    });

    test("Should be 401 when access token is expired", async () => {
      const expiredToken = jwt.sign(
        {
          id: "user-id",
          role: "USER",
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "-1s",
        },
      );

      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${expiredToken}`);
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("Invalid token");
    });
  });

  //test for 500 for login, register and me

  //Refresh API
  describe("POST /api/auth/refresh", () => {
    let refreshCookie;

    beforeEach(async () => {
      const loginRes = await request(app).post("/api/auth/login").send({
        email: "user@test.com",
        password: "Password@123",
      });

      refreshCookie = loginRes.headers["set-cookie"][0].split(";")[0];
    });

    test("Should generate new access token using refresh token", async () => {
      const response = await request(app)
        .post("/api/auth/refresh")
        .set("Cookie", refreshCookie);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("accessToken");
      expect(response.headers["set-cookie"]).toBeDefined();
    });

    test("Should return 401 when refresh token is missing", async () => {
      const response = await request(app).post("/api/auth/refresh");

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("No refresh token provided");
    });

    test("Should return 403 when refresh token is invalid", async () => {
      const response = await request(app)
        .post("/api/auth/refresh")
        .set("Cookie", "jid=invalid-token");

      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe("Invalid or expired refresh token");
    });

    test("Should reject previously used refresh token", async () => {
      const firstResponse = await request(app)
        .post("/api/auth/refresh")
        .set("Cookie", refreshCookie);

      expect(firstResponse.statusCode).toBe(200);

      const secondResponse = await request(app)
        .post("/api/auth/refresh")
        .set("Cookie", refreshCookie);

      expect(secondResponse.statusCode).toBe(403);
    });

    test("Should return 403 when refresh token is expired", async () => {
      const user = await prisma.user.findUnique({
        where: { email: "user@test.com" },
      });

      const expiredToken = jwt.sign(
        {
          id: user.id,
          tokenVersion: user.tokenVersion,
        },
        process.env.JWT_REFRESH_SECRET,
        {
          expiresIn: "-1s",
        },
      );

      const response = await request(app)
        .post("/api/auth/refresh")
        .set("Cookie", `jid=${expiredToken}`);

      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe("Invalid or expired refresh token");
    });

    test("Should reject previously used refresh token", async () => {
      const firstResponse = await request(app)
        .post("/api/auth/refresh")
        .set("Cookie", refreshCookie);

      expect(firstResponse.statusCode).toBe(200);

      const secondResponse = await request(app)
        .post("/api/auth/refresh")
        .set("Cookie", refreshCookie);

      expect(secondResponse.statusCode).toBe(403);
    });
  });

  //Logout API
  describe("POST /api/auth/logout", () => {
    let accessToken, refreshCookie;

    beforeEach(async () => {
      const loginRes = await request(app).post("/api/auth/login").send({
        email: "user@test.com",
        password: "Password@123",
      });

      accessToken = loginRes.body.accessToken;
      refreshCookie = loginRes.headers["set-cookie"][0].split(";")[0];
    });

    test("Should logout successfully", async () => {
      const response = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.body.message).toBe("Logged out");
      expect(response.headers["set-cookie"]).toBeDefined();
      expect(response.headers["set-cookie"][0]).toContain("jid=");
    });

    test("Should return 401 when access token is missing", async () => {
      const response = await request(app).post("/api/auth/logout");

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("No token provided");
    });

    test("Should return 401 when access token is invalid", async () => {
      const response = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", "Bearer invalid-token");

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("Invalid token");
    });

    test("Should invalidate refresh token after logout", async () => {
      const logoutResponse = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(logoutResponse.statusCode).toBe(200);

      const refreshResponse = await request(app)
        .post("/api/auth/refresh")
        .set("Cookie", refreshCookie);

      expect(refreshResponse.statusCode).toBe(403);
      expect(refreshResponse.body.message).toBe(
        "Invalid or expired refresh token",
      );
    });
  });

  describe("PUT /api/auth/change-password", () => {
    let accessToken;

    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash("Password@123", 10);

      await prisma.user.update({
        where: { email: "user@test.com" },
        data: { password: hashedPassword },
      });

      const loginResponse = await request(app).post("/api/auth/login").send({
        email: "user@test.com",
        password: "Password@123",
      });

      accessToken = loginResponse.body.accessToken;
    });

    test("Should password change successfully", async () => {
      const response = await request(app)
        .put("/api/auth/change-password")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          oldPassword: "Password@123",
          newPassword: "NewPassword@123",
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Password changed successfully");

      const user = await prisma.user.findUnique({
        where: { email: "user@test.com" },
      });

      const isPasswordValid = await bcrypt.compare(
        "NewPassword@123",
        user.password,
      );

      expect(isPasswordValid).toBe(true);
    });

    test("Should return 400 when old password is missing", async () => {
      const response = await request(app)
        .put("/api/auth/change-password")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          newPassword: "NewPassword@123",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Oldpassword are required");
    });

    test("Should return 400 when new password is missing", async () => {
      const response = await request(app)
        .put("/api/auth/change-password")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          oldPassword: "Password@123",
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("New password are required");
    });

    test("Should return 400 when old and new passwords are the same", async () => {
      const response = await request(app)
        .put("/api/auth/change-password")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          oldPassword: "Password@123",
          newPassword: "Password@123",
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe(
        "New password cannot be the same as old password",
      );
    });

    test("Should return 401 when access token is missing", async () => {
      const response = await request(app)
        .put("/api/auth/change-password")
        .send({
          oldPassword: "Password@123",
          newPassword: "NewPassword@123",
        });
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("No token provided");
    });

    test("Should return 401 when access token is invalid", async () => {
      const response = await request(app)
        .put("/api/auth/change-password")
        .set("Authorization", "Bearer invalid-token")
        .send({
          oldPassword: "Password@123",
          newPassword: "NewPassword@123",
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("Invalid token");
    });

    test("Should return 401 when old password is incorrect", async () => {
      const response = await request(app)
        .put("/api/auth/change-password")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          oldPassword: "WrongPassword@123",
          newPassword: "NewPassword@123",
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("Old password is incorrect");
    });

    test("Should return 404 when user not found", async () => {
      const fakeToken = jwt.sign(
        {
          id: "non-existing-user-id",
          role: "USER",
        },
        process.env.JWT_SECRET,
      );

      const response = await request(app)
        .put("/api/auth/change-password")
        .set("Authorization", `Bearer ${fakeToken}`)
        .send({
          oldPassword: "Password@123",
          newPassword: "NewPassword@123",
        });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe("User not found");
    });

    afterAll(async () => {
      const hashedPassword = await bcrypt.hash("Password@123", 10);

      await prisma.user.update({
        where: { email: "user@test.com" },
        data: { password: hashedPassword },
      });
    });
  });
});
