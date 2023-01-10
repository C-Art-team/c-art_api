const app = require("../app");
const request = require("supertest");
const { sequelize, User } = require("../models/");
const { queryInterface } = sequelize;
const { signToken, signRegisterToken, hashPassword } = require("../helpers/");

const validToken = signToken({
  id: 6,
  email: "dodol@gmail.com",
});
const noUserToken = signToken({
  id: 987654321,
  email: "123456789@gmail.com",
});
const registerToken = signRegisterToken({
  email: "dodol@gmail.com",
  password: "123456",
  username: "dodol",
});
const errorRegisterToken = signRegisterToken({
  email: "dodol123@gmail.com",
  password: "123456",
  username: "dodol123",
});
const user = {
  access_token: 1,
  id: 6,
  email: "dodol@gmail.com",
  username: "dodol26",
  preference: "Image Asset",
};

beforeAll(async () => {
  await queryInterface.bulkInsert(
    "Users",
    [
      {
        email: "kibuellyoi34@gmail.com",
        password: hashPassword("123456"),
        username: "kibuelll",
        preference: "3D Model",
        address: "Jakarta",
        phoneNumber: "08123456789",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "tonni_lius@yahoo.com",
        password: hashPassword("123456"),
        username: "Tonni",
        preference: "Image Asset",
        address: "Jakarta",
        phoneNumber: "08987654321",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {}
  );
});

beforeEach(() => {
  jest.restoreAllMocks();
});

describe("POST /register", () => {
  const data = {
    email: "dodol@gmail.com",
    password: "123456",
    username: "dodol",
  };
  test("200 - OK", async () => {
    const response = await request(app).post("/register").send(data);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      `Please check your email to verify dodol@gmail.com`
    );
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
    const usedEmail = { ...data, email: "tonni_lius@yahoo.com" };
    const response = await request(app).post("/register").send(usedEmail);
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
    const usedUsername = { ...data, username: "Tonni" };
    const response = await request(app).post("/register").send(usedUsername);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", 400);
    expect(response.body).toHaveProperty("message", "Username already used");
  });

  test("500 - Internal Server Error", async () => {
    jest.spyOn(User, "create").mockRejectedValue("Error");
    const response = await request(app).post("/register").send(data);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("status", 500);
    expect(response.body).toHaveProperty("message", "Internal Server Error");
  });
});

describe("GET /register/verify/:token", () => {
  test("201 - Created", async () => {
    const response = await request(app).get(
      `/register/verify/${registerToken}`
    );
    expect(response.status).toBe(201);
    console.log(response.body.id);
    expect(response.body).toHaveProperty("id", 6);
    expect(response.body).toHaveProperty("email", "dodol@gmail.com");
    expect(response.body).toHaveProperty("username", "dodol");
  });

  test("400 - Bad Request, Email already verified", async () => {
    const response = await request(app).get(
      `/register/verify/${registerToken}`
    );
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", 400);
    expect(response.body).toHaveProperty("message", "Email already verified");
  });

  test("400 - Bad Request, Null Email", async () => {
    const nullEmailToken = signRegisterToken({
      email: null,
      password: "123456",
      username: "dodol26",
    });
    const response = await request(app).get(
      `/register/verify/${nullEmailToken}`
    );
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", 400);
    expect(response.body).toHaveProperty("message", "Email is required");
  });
  test("400 - Bad Request, Empty Email", async () => {
    const emptyEmailToken = signRegisterToken({
      email: "",
      password: "123456",
      username: "dodol26",
    });
    const response = await request(app).get(
      `/register/verify/${emptyEmailToken}`
    );
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", 400);
    expect(response.body).toHaveProperty(
      "message",
      "Email is required, Invalid email format"
    );
  });
  test("400 - Bad Request, Invalid Email format", async () => {
    const invalidEmailToken = signRegisterToken({
      email: "dodol",
      password: "123456",
      username: "dodol26",
    });
    const response = await request(app).get(
      `/register/verify/${invalidEmailToken}`
    );
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", 400);
    expect(response.body).toHaveProperty("message", "Invalid email format");
  });

  test("400 - Bad Request, Null Password", async () => {
    const nullPasswordToken = signRegisterToken({
      email: "dodol26@gmail.com",
      password: null,
      username: "dodol26",
    });
    const response = await request(app).get(
      `/register/verify/${nullPasswordToken}`
    );
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", 400);
    expect(response.body).toHaveProperty("message", "Password is required");
  });
  test("400 - Bad Request, Empty Password", async () => {
    const emptyPasswordToken = signRegisterToken({
      email: "dodol26@gmail.com",
      password: "",
      username: "dodol26",
    });
    const response = await request(app).get(
      `/register/verify/${emptyPasswordToken}`
    );
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", 400);
    expect(response.body).toHaveProperty(
      "message",
      "Password is required, Password cannot be shorter than 5 character"
    );
  });
  test("400 - Bad Request, Password is too short", async () => {
    const shortPasswordToken = signRegisterToken({
      email: "dodol26@gmail.com",
      password: "1234",
      username: "dodol26",
    });
    const response = await request(app).get(
      `/register/verify/${shortPasswordToken}`
    );
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", 400);
    expect(response.body).toHaveProperty(
      "message",
      "Password cannot be shorter than 5 character"
    );
  });

  test("400 - Bad Request, Null Username", async () => {
    const nullUsernameToken = signRegisterToken({
      email: "dodol26@gmail.com",
      password: "123456",
      username: null,
    });
    const response = await request(app).get(
      `/register/verify/${nullUsernameToken}`
    );
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", 400);
    expect(response.body).toHaveProperty("message", "Username is required");
  });
  test("400 - Bad Request, Empty Username", async () => {
    const emptyUsernameToken = signRegisterToken({
      email: "dodol26@gmail.com",
      password: "123456",
      username: "",
    });
    const response = await request(app).get(
      `/register/verify/${emptyUsernameToken}`
    );
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", 400);
    expect(response.body).toHaveProperty(
      "message",
      "Username is required, Username cannot be shorter than 5 character"
    );
  });
  test("400 - Bad Request, Username is too short", async () => {
    const shortUsernameToken = signRegisterToken({
      email: "dodol26@gmail.com",
      password: "123456",
      username: "dodo",
    });
    const response = await request(app).get(
      `/register/verify/${shortUsernameToken}`
    );
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", 400);
    expect(response.body).toHaveProperty(
      "message",
      "Username cannot be shorter than 5 character"
    );
  });

  test("500 - Internal Server Error, findOne", async () => {
    jest.spyOn(User, "findOne").mockRejectedValue("Error");
    const response = await request(app).get(
      `/register/verify/${errorRegisterToken}`
    );
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("status", 500);
    expect(response.body).toHaveProperty("message", "Internal Server Error");
  });
  test("500 - Internal Server Error, create", async () => {
    jest.spyOn(User, "create").mockRejectedValue("Error");
    const response = await request(app).get(
      `/register/verify/${errorRegisterToken}`
    );
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("status", 500);
    expect(response.body).toHaveProperty("message", "Internal Server Error");
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
    expect(response.body).toHaveProperty("preference");
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

  test("500 - Internal Server Error", async () => {
    jest.spyOn(User, "findOne").mockRejectedValue("Error");
    const response = await request(app).post("/login").send(data);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("status", 500);
    expect(response.body).toHaveProperty("message", "Internal Server Error");
  });
});

describe("POST /facebookLogin", () => {
  const data = {
    email: "dodol@gmail.com",
    username: "dodol",
  };
  test("200 - OK, email already registered", async () => {
    const response = await request(app).post("/facebookLogin").set(data);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token", expect.any(String));
    expect(response.body).toHaveProperty("id", 6);
    expect(response.body).toHaveProperty("email", "dodol@gmail.com");
    expect(response.body).toHaveProperty("username", "dodol");
    expect(response.body).toHaveProperty("preference");
  });
  test("200 - OK, email is not registered yet", async () => {
    const newUser = {
      email: "Mark@gmail.com",
      username: "MarkZ",
    };
    const response = await request(app).post("/facebookLogin").set(newUser);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token", expect.any(String));
    expect(response.body).toHaveProperty("id", 7);
    expect(response.body).toHaveProperty("email", "Mark@gmail.com");
    expect(response.body).toHaveProperty("username", "MarkZ");
    expect(response.body).toHaveProperty("preference");
  });

  test("500 - Internal Server Error", async () => {
    jest.spyOn(User, "findOrCreate").mockRejectedValue("Error");
    const response = await request(app).post("/facebookLogin").set(data);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("status", 500);
    expect(response.body).toHaveProperty("message", "Internal Server Error");
  });
});

describe("POST /googleLogin", () => {
  const google_token =
    "eyJhbGciOiJSUzI1NiIsImtpZCI6ImEyOWFiYzE5YmUyN2ZiNDE1MWFhNDMxZTk0ZmEzNjgwYWU0NThkYTUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2NzMzMjI5MDksImF1ZCI6IjM3MzE5Nzg4MDQ2LXVsajIxcWY5aDQ3a3J1NmczNThtbnR0ODVoNjFqbDk1LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTEwMTEyNDQwNjI5MzEwODA0NTg0IiwiZW1haWwiOiJ0b25uaS5saXVzMjZAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF6cCI6IjM3MzE5Nzg4MDQ2LXVsajIxcWY5aDQ3a3J1NmczNThtbnR0ODVoNjFqbDk1LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwibmFtZSI6IlRvbm5pIExpdXMiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUVkRlRwNmFJbXN2VXpGX3c3QjVuN1dBVk5WWThvVnQtcl9uYTFkUDFjQT1zOTYtYyIsImdpdmVuX25hbWUiOiJUb25uaSIsImZhbWlseV9uYW1lIjoiTGl1cyIsImlhdCI6MTY3MzMyMzIwOSwiZXhwIjoxNjczMzI2ODA5LCJqdGkiOiIxYTg2MDNlOTkwY2Q2OTE4M2Y5Y2UxZTM3MmIzNGM1NzM2MGM4M2RmIn0.Td6LQ7EhswnZdCcYJhus4gHDqadlzmIhzUITlU65lZKmWD_QSyuWfUShMsy2eGf2eFoi-gjyrmcCbLSBAPUy0FOJikzIu59dK_QdAM5rBkDKx3MYtkzVFgoPAIpJxdsVpi7DQCej5EIcRtdxQkdoHMFcTMqAlkWxj8ULsR7kgufyHTvvX50V25gbG3LP4rHidq1LWBXIaLN8pwTCegeSQ5Vnl7hmlgGTWT-BNuwexcRupsbgtbbxqShVUFMFe2u8sdB2zjPVdsJl3IiYUFU-BuQXuITjBFtZ0edsfCCAkPxqRIXbBbkcA-ef0qDX0gjSbxpzLelU8ImWqmctJ_FLew";
  test("200 - OK, email is not registered yet", async () => {
    const response = await request(app)
      .post("/googleLogin")
      .set({ google_token });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token", expect.any(String));
    expect(response.body).toHaveProperty("id", 8);
    expect(response.body).toHaveProperty("email", "tonni.lius26@gmail.com");
    expect(response.body).toHaveProperty("username", "Tonni Lius");
    expect(response.body).toHaveProperty("preference");
  });
  test("200 - OK, email already registered", async () => {
    const response = await request(app)
      .post("/googleLogin")
      .set({ google_token });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token", expect.any(String));
    expect(response.body).toHaveProperty("id", 8);
    expect(response.body).toHaveProperty("email", "tonni.lius26@gmail.com");
    expect(response.body).toHaveProperty("username", "Tonni Lius");
    expect(response.body).toHaveProperty("preference");
  });

  test("500 - Internal Server Error", async () => {
    jest.spyOn(User, "findOrCreate").mockRejectedValue("Error");
    const response = await request(app)
      .post("/googleLogin")
      .set({ google_token });
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("status", 500);
    expect(response.body).toHaveProperty("message", "Internal Server Error");
  });
});

describe("PATCH /edit/:id", () => {
  const data = {
    username: "dodol26",
    preference: ["Image Asset"],
    address: "Jakarta",
    phoneNumber: "08123456789",
  };
  test("200 - OK", async () => {
    const response = await request(app).patch("/edit/6").send(data);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", "6");
    expect(response.body).toHaveProperty("username", "dodol26");
    expect(response.body).toHaveProperty("preference", ["Image Asset"]);
    expect(response.body).toHaveProperty("address", "Jakarta");
    expect(response.body).toHaveProperty("phoneNumber", "08123456789");
  });

  test("400 - Bad Request, User Empty", async () => {
    const emptyUser = { ...data, username: "" };
    const response = await request(app).patch("/edit/6").send(emptyUser);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", 400);
    expect(response.body).toHaveProperty("message", "Username cannot be empty");
  });
  test("404 - Not Found", async () => {
    const response = await request(app).patch("/edit/100").send(data);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("status", 404);
    expect(response.body).toHaveProperty("message", "User not found");
  });

  test("500 - Internal Server Error, findOne", async () => {
    jest.spyOn(User, "findOne").mockRejectedValue("Error");
    const response = await request(app).patch("/edit/6").send(data);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("status", 500);
    expect(response.body).toHaveProperty("message", "Internal Server Error");
  });
  test("500 - Internal Server Error, update", async () => {
    jest.spyOn(User, "update").mockRejectedValue("Error");
    const response = await request(app).patch("/edit/6").send(data);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("status", 500);
    expect(response.body).toHaveProperty("message", "Internal Server Error");
  });
});

describe("GET /authenticating", () => {
  test("200 - OK", async () => {
    const response = await request(app)
      .get("/authenticating")
      .set({ access_token: validToken });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", 6);
    expect(response.body).toHaveProperty("email", "dodol@gmail.com");
    expect(response.body).toHaveProperty("username", "dodol26");
    expect(response.body).toHaveProperty("preference", "Image Asset");
  });

  test("401 - Unauthorized, No token", async () => {
    const response = await request(app).get("/authenticating");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("status", 401);
    expect(response.body).toHaveProperty("message", "Please login first");
  });
  test("401 - Unauthorized, No user token", async () => {
    const access_token = noUserToken;
    const response = await request(app)
      .get("/authenticating")
      .set({ access_token });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("status", 401);
    expect(response.body).toHaveProperty("message", "Please login first");
  });
  test("401 - Unauthorized, JsonWebTokenError", async () => {
    const access_token = { access_token: "" };
    const response = await request(app)
      .get("/authenticating")
      .set({ access_token });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("status", 401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("500 - Internal Server Error", async () => {
    jest.spyOn(User, "findOne").mockRejectedValue("Error");
    const response = await request(app)
      .get("/authenticating")
      .set({ access_token: validToken });
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("status", 500);
    expect(response.body).toHaveProperty("message", "Internal Server Error");
  });
});

describe("GET /profile", () => {
  test("200 - OK", async () => {
    const response = await request(app).get("/profile").set(user);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", 6);
    expect(response.body).toHaveProperty("email", "dodol@gmail.com");
    expect(response.body).toHaveProperty("username", "dodol26");
    expect(response.body).toHaveProperty("preference", "Image Asset");
    expect(response.body).toHaveProperty("address", "Jakarta");
    expect(response.body).toHaveProperty("phoneNumber", "08123456789");
  });

  test("401 - Unauthorized, No token", async () => {
    const response = await request(app).get("/profile");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("status", 401);
    expect(response.body).toHaveProperty("message", "Please login first");
  });
  test("404 - Not Found", async () => {
    const invalidUser = { ...user, id: 987654321 };
    const response = await request(app).get("/profile").set(invalidUser);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("status", 404);
    expect(response.body).toHaveProperty("message", "User not found");
  });

  test("500 - Internal Server Error", async () => {
    jest.spyOn(User, "findOne").mockRejectedValue("Error");
    const response = await request(app).get("/profile").set(user);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("status", 500);
    expect(response.body).toHaveProperty("message", "Internal Server Error");
  });
});

describe("GET /:id", () => {
  test("200 - OK", async () => {
    const response = await request(app).get("/2");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", 2);
    expect(response.body).toHaveProperty("email", "tonni_lius@yahoo.com");
    expect(response.body).toHaveProperty("username", "Tonni");
    expect(response.body).toHaveProperty("preference", "Image Asset");
    expect(response.body).toHaveProperty("address", "Jakarta");
    expect(response.body).toHaveProperty("phoneNumber", "08987654321");
  });

  test("404 - Not Found", async () => {
    const response = await request(app).get("/123456789");
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("status", 404);
    expect(response.body).toHaveProperty("message", "User not found");
  });

  test("500 - Internal Server Error", async () => {
    jest.spyOn(User, "findOne").mockRejectedValue("Error");
    const response = await request(app).get("/2");
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("status", 500);
    expect(response.body).toHaveProperty("message", "Internal Server Error");
  });
});

describe("DELETE /delete/:id", () => {
  test("401 - Unauthorized, No token", async () => {
    const response = await request(app).delete("/delete/6");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("status", 401);
    expect(response.body).toHaveProperty("message", "Please login first");
  });
  test("403 - Forbidden", async () => {
    const invalidUser = { ...user, id: 987654321 };
    const response = await request(app).delete("/delete/6").set(invalidUser);
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("status", 403);
    expect(response.body).toHaveProperty("message", "You don't have access");
  });
  test("404 - Not Found", async () => {
    const invalidUser = { ...user, id: 987654321 };
    const response = await request(app)
      .delete("/delete/987654321")
      .set(invalidUser);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("status", 404);
    expect(response.body).toHaveProperty("message", "User not found");
  });

  test("500 - Internal Server Error, findOne", async () => {
    jest.spyOn(User, "findOne").mockRejectedValue("Error");
    const response = await request(app).delete("/delete/6").set(user);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("status", 500);
    expect(response.body).toHaveProperty("message", "Internal Server Error");
  });
  test("500 - Internal Server Error, destroy", async () => {
    jest.spyOn(User, "destroy").mockRejectedValue("Error");
    const response = await request(app).delete("/delete/6").set(user);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("status", 500);
    expect(response.body).toHaveProperty("message", "Internal Server Error");
  });

  test("200 - OK", async () => {
    const response = await request(app).delete("/delete/6").set(user);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", 6);
    expect(response.body).toHaveProperty("email", "dodol@gmail.com");
    expect(response.body).toHaveProperty("username", "dodol26");
    expect(response.body).toHaveProperty("preference", "Image Asset");
    expect(response.body).toHaveProperty("address", "Jakarta");
    expect(response.body).toHaveProperty("phoneNumber", "08123456789");
  });
});

afterAll(async () => {
  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});
