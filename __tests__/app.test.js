const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const app = require("../app");
const fs = require("fs/promises");

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
  describe("GET /api/articles", () => {
    test("200: returns an array with articles", async () => {
      const response = await request(app).get("/api/articles");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.articles));
    });
    test("200: properties in the returned array", async () => {
      const response = await request(app).get("/api/articles");
      const articles = response.body.articles;
      articles.forEach((article) => {
        expect(typeof article.author).toBe("string");
        expect(typeof article.title).toBe("string");
        expect(typeof article.article_id).toBe("number");
        expect(typeof article.topic).toBe("string");
        expect(typeof article.created_at).toBe("string");
        expect(typeof article.votes).toBe("number");
        expect(typeof article.article_img_url).toBe("string");
        expect(typeof article.comment_count).toBe("number");
      });
    });
    test("200: returns articles without the body property", async () => {
      const response = await request(app).get("/api/articles");
      const articles = response.body.articles;
      articles.forEach((article) => {
        expect(article.hasOwnProperty("body")).toBe(false);
      });
    });
    test("200: return the articles ordered by data in decending order", async () => {
      const response = await request(app).get("/api/articles");
      const articles = response.body.articles;
      expect(articles).toBeSorted({ descending: true, key: "created_at" });
    });
  });
  describe("GET /api", () => {
    test("200: returns an object with all available endpoints", async () => {
      const response = await request(app).get("/api");
      expect(response.status).toBe(200);
      expect(typeof response.body.endpoints).toBe("object");
      const endpointsObject = await fs.readFile(
        `${__dirname}/../endpoints.json`,
        "utf-8"
      );
      expect(response.body.endpoints).toEqual(JSON.parse(endpointsObject));
    });
    test("200: returns an object with all a description on each endpoint", async () => {
      const response = await request(app).get("/api");
      const endpoints = response.body.endpoints;
      for (const key in endpoints) {
        expect(typeof endpoints[key].description).toBe("string");
      }
    });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    test("200: returns an array with all available comments for that article", async () => {
      const response = await request(app).get("/api/articles/1/comments");
      const articleComments = response.body.comments;
      expect(response.status).toBe(200);
      expect(Array.isArray(articleComments)).toBe(true);
    });
    test("200: each object has properties", async () => {
      const response = await request(app).get("/api/articles/1/comments");
      const articleComments = response.body.comments;
      articleComments.forEach((comment) => {
        expect(typeof comment.votes).toBe("number");
        expect(typeof comment.votes).toBe("number");
        expect(typeof comment.created_at).toBe("string");
        expect(typeof comment.author).toBe("string");
        expect(typeof comment.body).toBe("string");
        expect(typeof comment.article_id).toBe("number");
      });
    });
    test("200: when there are no comments responds with an empty array", async () => {
      const response = await request(app).get("/api/articles/7/comments");
      const articleComments = response.body.comments;
      expect(response.status).toBe(200);
      expect(articleComments.length).toBe(0);
    });
    test("200: comments should be served with the most recent first", async () => {
      const response = await request(app).get("/api/articles/1/comments");
      const articleComments = response.body.comments;
      expect(response.status).toBe(200);
      expect(articleComments).toBeSorted({
        descending: true,
        key: "created_at",
      });
    });
    test("400: when passed an invalid id", async () => {
      const response = await request(app).get("/api/articles/hmm/comments");
      const msg = response.body.msg;
      expect(response.status).toBe(400);
      expect(msg).toBe("Bad Request");
    });
    test("404: when passed a valid but not available id", async () => {
      const response = await request(app).get("/api/articles/1000/comments");
      const msg = response.body.msg;
      expect(response.status).toBe(404);
      expect(msg).toBe("Not found");
    });
  });
  describe("POST /api/articles/:articles_id/comments", () => {
    test("400: when passed a body or username that does not have required properties", async () => {
      const response = await request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "Anonymous",
        });
      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("Bad Request");

      const response1 = await request(app)
        .post("/api/articles/1/comments")
        .send({
          body: "Anonymous user sends their regards",
        });
      expect(response1.status).toBe(400);
      expect(response1.body.msg).toBe("Bad Request");
    });
    test("404: when posting to an article_id that does not exist but is valid", async () => {
      const response = await request(app)
        .post("/api/articles/600/comments")
        .send({
          username: "Anonymous",
          body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        });
      expect(response.status).toBe(404);
      expect(response.body.msg).toBe("Not found");
    });
    test("400: when posting to an article_id that is invalid", async () => {
      const response = await request(app)
        .post("/api/articles/hmm/comments")
        .send({
          username: "Anonymous",
          body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        });
      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("Bad Request");
    });
    test("202: adds the comment posted", async () => {
      const response = await request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "lurker",
          body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        });
      const comment = response.body.comment;
      expect(response.status).toBe(202);
      expect(typeof comment.comment_id).toBe("number");
      expect(typeof comment.body).toBe("string");
      expect(typeof comment.article_id).toBe("number");
      expect(typeof comment.author).toBe("string");
      expect(typeof comment.votes).toBe("number");
      expect(typeof comment.created_at).toBe("string");
    });
    test("400: when a user does not exist", async () => {
      const response = await request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "Anonymous",
          body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        });
      const message = response.body.msg;
      expect(response.status).toBe(400);
      expect(message).toBe("Bad Request");
    });
  });
});

/* 
 body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
*/