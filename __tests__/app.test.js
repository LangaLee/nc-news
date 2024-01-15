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
  describe("GET /api/articles/:article_id", () => {
    test("200: returns with the correct article", async () => {
      const response = await request(app).get("/api/articles/2");
      expect(response.status).toBe(200);
      expect(Object.keys(response.body.article)).toHaveLength(8);
    });
    test("200: return the articles with all the properties", async () => {
      const response = await request(app).get("/api/articles/1");
      const article = response.body.article;
      expect(article.hasOwnProperty("author")).toBe(true);
      expect(article.hasOwnProperty("title")).toBe(true);
      expect(article.hasOwnProperty("article_id")).toBe(true);
      expect(article.hasOwnProperty("body")).toBe(true);
      expect(article.hasOwnProperty("topic")).toBe(true);
      expect(article.hasOwnProperty("created_at")).toBe(true);
      expect(article.hasOwnProperty("votes")).toBe(true);
      expect(article.hasOwnProperty("article_img_url")).toBe(true);
    });
    test("404: when passed an id that is valid but does not exist", async () => {
      const response = await request(app).get("/api/articles/9000");
      const message = response.body.msg;
      expect(response.status).toBe(404);
      expect(message).toBe("Not found");
    });
    test("400: when passed an id that is not valid", async () => {
      const response = await request(app).get("/api/articles/sup");
      const message = response.body.msg;
      expect(response.status).toBe(400);
      expect(message).toBe("Bad Request");
    });
  });
});
