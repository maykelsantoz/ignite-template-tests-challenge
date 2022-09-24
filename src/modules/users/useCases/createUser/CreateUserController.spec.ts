import request from "supertest";
import { Connection } from "typeorm";

import createConnection from "../../../../database";
import { app } from "../../../../app";

let connection: Connection;

describe("Create user", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "userCreate",
      email: "userCreate@email.com.br",
      password: "userpassword"
    });

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("id")
    expect(response.body.name).toEqual("userCreate")
    expect(response.body.email).toEqual("userCreate@email.com.br")
  });

  it("should not be able to create a new user with same email", async () => {
    await request(app).post("/api/v1/users").send({
      name: "userCreate",
      email: "userCreate@email.com.br",
      password: "userpassword"
    });

    const response = await request(app).post("/api/v1/users").send({
      name: "userCreate",
      email: "userCreate@email.com.br",
      password: "userpassword"
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("User already exists")
  });
});
