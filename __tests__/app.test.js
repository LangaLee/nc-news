const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const app = require("../app");

beforeEach(() => seed(data));
afterAll(() => db.end());
describe("testing endpoints", () => {
  describe("GET /api/topics", () => {
    test("200: returns all topics when requested", async () => {
      const response = await request(app).get("/api/topics");
      expect(response.status).toBe(200);
      response.body.topics.forEach((topic) => {
        expect(topic.hasOwnProperty("slug")).toBe(true);
        expect(topic.hasOwnProperty("description")).toBe(true);
      });
    });
    test("404: if the end point being send is not available", async () => {
      const response = await request(app).get("/api/topcs");
      expect(response.status).toBe(404);
      expect(response.body.msg).toBe("Not found");
    });
  });
});
