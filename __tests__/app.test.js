const request = require("supertest");
const app = require("../app");
const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
/* Set up your test imports here */

const topicData = require("../db/data/test-data/topics");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});
/* Set up your beforeEach & afterAll functions here */

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toEqual(topicData);
      });
  });

  test("404: Responds with a 404 error if endpoint not found", () => {
    return request(app)
      .get("/api/notATopic")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Route not found");
      });
  });
});
