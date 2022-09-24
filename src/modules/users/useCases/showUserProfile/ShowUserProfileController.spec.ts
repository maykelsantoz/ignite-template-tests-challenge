import request from "supertest";
import { Connection } from "typeorm";

import createConnection from "../../../../database";
import { app } from "../../../../app";

let connection: Connection;
describe("Show profile user", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post("/api/v1/users").send({
      name: "user name",
      email: "user1@challenger.com.br",
      password: "userpassword",
    });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to list user's profile", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "user1@challenger.com.br",
      password: "userpassword",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200)
  });

  it("should not be able to list non-existing user's profile", async () => {
    const responsesToken = await request(app).post("/api/v1/sessions").send({
      email: "wronguser@challenger.com.br",
      password: "wronguserpassword",
    });

    expect(responsesToken.status).toBe(401)
    expect(responsesToken.body.message).toEqual('Incorrect email or password')
    expect(responsesToken.body.token).toBe(undefined)

    const { token } = responsesToken.body;

    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(401)
    expect(response.body.message).toEqual('JWT invalid token!')
  });
});
