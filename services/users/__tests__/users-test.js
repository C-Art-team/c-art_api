const app = require("../app");
const request = require("supertest");
const { sequelize } = require("../models/");
const { queryInterface } = sequelize;

describe("POST /register", () => {
  const data = {
    email: "dodol@gmail.com",
    password: "123456",
    username: "dodol",
  };
  test("201 - Created", async () => {
    const response = await request(app).post("/register").send(data);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id", 1);
    expect(response.body).toHaveProperty("email", "dodol@gmail.com");
    expect(response.body).toHaveProperty("username", "dodol");
  });

  test("400 - Bad Request, Null Email", async () => {
    const nullEmail = { ...data, email: null };
    const response = await request(app).post("/register").send(nullEmail);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", 400);
    expect(response.body).toHaveProperty("message", "Email is required");
  });
  test("400 - Bad Request, Empty Email", async () => {
    const emptyEmail = { ...data, email: "" };
    const response = await request(app).post("/register").send(emptyEmail);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", 400);
    expect(response.body).toHaveProperty(
      "message",
      "Email is required, Invalid email format"
    );
  });
  test("400 - Bad Request, Invalid Email format", async () => {
    const invalidEmail = { ...data, email: "dodol" };
    const response = await request(app).post("/register").send(invalidEmail);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", 400);
    expect(response.body).toHaveProperty("message", "Invalid email format");
  });
  test("400 - Bad Request, Email already used", async () => {
    const response = await request(app).post("/register").send(data);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", 400);
    expect(response.body).toHaveProperty("message", "Email already used");
  });

  test("400 - Bad Request, Null Password", async () => {
    const nullPassword = { ...data, password: null };
    const response = await request(app).post("/register").send(nullPassword);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", 400);
    expect(response.body).toHaveProperty("message", "Password is required");
  });
  test("400 - Bad Request, Empty Password", async () => {
    const emptyPassword = { ...data, password: "" };
    const response = await request(app).post("/register").send(emptyPassword);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", 400);
    expect(response.body).toHaveProperty(
      "message",
      "Password is required, Password cannot be shorter than 5 character"
    );
  });
  test("400 - Bad Request, Password is too short", async () => {
    const shortPassword = { ...data, password: "1234" };
    const response = await request(app).post("/register").send(shortPassword);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", 400);
    expect(response.body).toHaveProperty(
      "message",
      "Password cannot be shorter than 5 character"
    );
  });

  test("400 - Bad Request, Null Username", async () => {
    const nullUsername = { ...data, username: null };
    const response = await request(app).post("/register").send(nullUsername);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", 400);
    expect(response.body).toHaveProperty("message", "Username is required");
  });
  test("400 - Bad Request, Empty Username", async () => {
    const emptyUsername = { ...data, username: "" };
    const response = await request(app).post("/register").send(emptyUsername);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", 400);
    expect(response.body).toHaveProperty(
      "message",
      "Username is required, Username cannot be shorter than 5 character"
    );
  });
  test("400 - Bad Request, Username is too short", async () => {
    const shortUsername = { ...data, username: "dodo" };
    const response = await request(app).post("/register").send(shortUsername);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", 400);
    expect(response.body).toHaveProperty(
      "message",
      "Username cannot be shorter than 5 character"
    );
  });
  test("400 - Bad Request, Username already used", async () => {
    const usedUsername = { ...data, email: "tonni@gmail.com" };
    const response = await request(app).post("/register").send(usedUsername);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", 400);
    expect(response.body).toHaveProperty("message", "Username already used");
  });
});

describe("POST /login", () => {
  const data = {
    email: "dodol@gmail.com",
    password: "123456",
  };
  test("200 - OK", async () => {
    const response = await request(app).post("/login").send(data);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token", expect.any(String));
    expect(response.body).toHaveProperty("email", "dodol@gmail.com");
    expect(response.body).toHaveProperty("username", "dodol");
  });

  test("400 - Bad Request, Empty Email", async () => {
    const emptyEmail = { ...data, email: "" };
    const response = await request(app).post("/login").send(emptyEmail);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", 400);
    expect(response.body).toHaveProperty(
      "message",
      "Both Email and Password is required"
    );
  });
  test("400 - Bad Request, Empty Password", async () => {
    const emptyPassword = { ...data, password: "" };
    const response = await request(app).post("/login").send(emptyPassword);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", 400);
    expect(response.body).toHaveProperty(
      "message",
      "Both Email and Password is required"
    );
  });

  test("401 - Unauthorized, Invalid Email", async () => {
    const invalidEmail = { ...data, email: "dodol1@gmail.com" };
    const response = await request(app).post("/login").send(invalidEmail);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("status", 401);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid Email or Password"
    );
  });
  test("401 - Unauthorized, Invalid Password", async () => {
    const invalidPassword = { ...data, password: "dodol" };
    const response = await request(app).post("/login").send(invalidPassword);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("status", 401);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid Email or Password"
    );
  });
});

afterAll(async () => {
  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});
