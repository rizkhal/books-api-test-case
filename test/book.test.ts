import request from "supertest";
import app from "../src/app";
import { Express } from "express-serve-static-core";

let server: Express;

beforeAll(async () => {
  server = app;
});

describe("GET /api/v1/books", () => {
  it("responds with a json message", (done) => {
    request(server)
      .get("/api/v1/books")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        done();
      });
  });
});
