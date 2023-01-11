const app = require("../app");
const request = require("supertest");
const { sequelize } = require("../models/");
const { queryInterface } = sequelize;

jest.mock("../helpers/google-auth-library", () => {
  return jest.fn((token) => {
    return {
      email: "test-google-login@gmail.com",
      name: "gugle",
    };
  });
});

describe("POST /googleLogin, 200 - OK", () => {
  test("200 - OK, email is not registered yet", async () => {
    const response = await request(app)
      .post("/googleLogin")
      .set({ google_token: 1 });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token", expect.any(String));
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty(
      "email",
      "test-google-login@gmail.com"
    );
    expect(response.body).toHaveProperty("username", "gugle");
    expect(response.body).toHaveProperty("preference");
  });
  test("200 - OK, email already registered", async () => {
    const response = await request(app)
      .post("/googleLogin")
      .set({ google_token: 1 });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token", expect.any(String));
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty(
      "email",
      "test-google-login@gmail.com"
    );
    expect(response.body).toHaveProperty("username", "gugle");
    expect(response.body).toHaveProperty("preference");
  });
});

afterAll(async () => {
  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});
