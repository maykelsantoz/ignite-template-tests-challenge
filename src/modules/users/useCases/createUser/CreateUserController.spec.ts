import request from "supertest";
import { Connection } from "typeorm";

import createConnection from "../../../../database";
import { app } from "../../../../app";

let connection: Connection;
let newUserCreated: {
  name: string;
  email: string;
  password: string;
}

describe("Create user", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    newUserCreated = {
      name: "user name",
      email: "user@challenger.com.br",
      password: "userpassword",
    }

    await request(app).post("/api/v1/users").send(newUserCreated);

  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      email: newUserCreated.email,
      password: newUserCreated.password,
    });

    expect(response.status).toBe(201)
  });

  it("should not be able to create a new user with same email", async () => {
    await request(app).post("/api/v1/users").send({
      name: newUserCreated.name,
      email: newUserCreated.email,
      password: newUserCreated.password,
    });

    const response = await request(app).post("/api/v1/users").send({
      name: newUserCreated.name,
      email: newUserCreated.email,
      password: newUserCreated.password,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("User already exists")
  });
});
