import request from "supertest";
import { Connection } from "typeorm";

import createConnection from "../../../../database";
import { app } from "../../../../app";

let connection: Connection;
let newUser: {
  name: string;
  email: string;
  password: string;
}

describe("Authenticate User", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    newUser = {
      name: "user name",
      email: "user@challenger.com.br",
      password: "userpassword",
    }

    await request(app).post("/api/v1/users").send(newUser);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate user", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: newUser.email,
      password: newUser.password,
    });

    const { token } = responseToken.body;

    expect(responseToken.status).toBe(200)
    expect(responseToken.body).toHaveProperty("token")
    expect(responseToken.body.user.email).toEqual(newUser.email)

    expect(token).not.toBeUndefined()
  });
});
