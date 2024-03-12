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
        expect(typeof topic.slug).toBe("string");
        expect(typeof topic.description).toBe("string");
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
      expect(typeof article.author).toBe("string");
      expect(typeof article.title).toBe("string");
      expect(typeof article.article_id).toBe("number");
      expect(typeof article.body).toBe("string");
      expect(typeof article.topic).toBe("string");
      expect(typeof article.created_at).toBe("string");
      expect(typeof article.votes).toBe("number");
      expect(typeof article.article_img_url).toBe("string");
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
      expect(articleComments.length).toBe(11);
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
          username: "lurker",
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
          username: "lurker",
          body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        });
      expect(response.status).toBe(404);
      expect(response.body.msg).toBe("Not found");
    });
    test("400: when posting to an article_id that is invalid", async () => {
      const response = await request(app)
        .post("/api/articles/hmm/comments")
        .send({
          username: "lurker",
          body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        });
      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("Bad Request");
    });
    test("201: adds the comment posted", async () => {
      const response = await request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "lurker",
          body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        });
      const comment = response.body.comment;
      expect(response.status).toBe(201);
      expect(typeof comment.comment_id).toBe("number");
      expect(typeof comment.body).toBe("string");
      expect(typeof comment.article_id).toBe("number");
      expect(typeof comment.author).toBe("string");
      expect(typeof comment.votes).toBe("number");
      expect(typeof comment.created_at).toBe("string");
    });
    test("404: when a user does not exist", async () => {
      const response = await request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "Anonymous",
          body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        });
      const message = response.body.msg;
      expect(response.status).toBe(404);
      expect(message).toBe("Not found");
    });
  });
  describe("PACTH /api/articles/:article_id", () => {
    test("404: when passed an id that is valid but doesnt exist", async () => {
      const response = await request(app)
        .patch("/api/articles/500")
        .send({ inc_votes: 20 });
      expect(response.status).toBe(404);
      expect(response.body.msg).toBe("Not found");
    });
    test("400: when passed an id that is invalid", async () => {
      const response = await request(app)
        .patch("/api/articles/hmm")
        .send({ inc_votes: 20 });
      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("Bad Request");
    });
    test("400: when passed a body in the wrong form", async () => {
      const response = await request(app)
        .patch("/api/articles/2")
        .send({ increment_vote: 2 });
      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("Bad Request");
    });
    test("200: updates the votes to the requested article", async () => {
      const response = await request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -2 });
      const { article } = response.body;
      expect(article.votes).toBe(98);
      expect(response.status).toBe(200);
      expect(typeof article.author).toBe("string");
      expect(typeof article.title).toBe("string");
      expect(typeof article.article_id).toBe("number");
      expect(typeof article.topic).toBe("string");
      expect(typeof article.created_at).toBe("string");
      expect(typeof article.article_img_url).toBe("string");
    });
  });
  describe("DELETE /api/comments/:comment_id", () => {
    test("204: deletes the given comment by comment_id", async () => {
      const response = await request(app).delete("/api/comments/18");
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
    test("404: when passed a comment_id that is valid but doesnt exist", async () => {
      const response = await request(app).delete("/api/comments/30");
      expect(response.status).toBe(404);
      expect(response.body.msg).toBe("Not found");
    });
    test("400: when passed a comment_id that is invalid", async () => {
      const response = await request(app).delete("/api/comments/hmm");
      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("Bad Request");
    });
  });
  describe("GET /api/users", () => {
    test("200: returns an array of objects with users", async () => {
      const response = await request(app).get("/api/users");
      const users = response.body.users;
      expect(response.status).toBe(200);
      expect(users.length).toBe(4);
      users.forEach((user) => {
        expect(typeof user.username).toBe("string");
        expect(typeof user.name).toBe("string");
        expect(typeof user.avatar_url).toBe("string");
      });
    });
  });
  describe("GET /api/articles?topic=requested_topic", () => {
    test("200: returns articles on that topic", async () => {
      const response = await request(app).get("/api/articles?topic=mitch");
      const { articles } = response.body;
      expect(response.status).toBe(200);
      articles.forEach((article) => {
        expect(article.topic).toBe("mitch");
      });
    });
    test("200: returns all articles if query is omitted", async () => {
      const response = await request(app).get("/api/articles?topic");
      expect(response.status).toBe(200);
      const { articles } = response.body;
      expect(Array.isArray(articles)).toBe(true);
      expect(articles.length).toBe(13);
    });
    test("404: when passed the query is a topic that doesnt exist", async () => {
      const response = await request(app).get("/api/articles?topic=music");
      const { msg } = response.body;
      expect(response.status).toBe(404);
      expect(msg).toBe("Not found");
    });
    test("200: when passed a topic that exists but has no articles", async () => {
      const response = await request(app).get("/api/articles?topic=paper");
      const { articles } = response.body;
      expect(response.status).toBe(200);
      expect(articles.length).toBe(0);
    });
  });
  describe("GET /api/articles/:article_id?comment_count", () => {
    test("200: returns the requested article with the comment count", async () => {
      const response = await request(app).get("/api/articles/1?comment_count");
      const { article } = response.body;
      expect(response.status).toBe(200);
      expect(typeof article.comment_count).toBe("number");
      expect(article.comment_count).toBe(11);
    });
  });
  describe("GET /api/articles?sort_by=author&&order=asc", () => {
    test("200: returns articles sorted by the passed query", async () => {
      const response = await request(app).get(
        "/api/articles?sort_by=author&&order=asc"
      );
      const { articles } = response.body;
      expect(response.status).toBe(200);
      expect(articles).toBeSorted({ key: "author", ascending: true });
    });
    test("200: returns articles sorted by date descending if no sort or order queries are passed", async () => {
      const response = await request(app).get("/api/articles");
      const { articles } = response.body;
      expect(response.status).toBe(200);
      expect(articles).toBeSorted({ key: "created_at", descending: true });
    });
    test("400: when trying to sort by a query that does not exist sorts by the defualt", async () => {
      const response = await request(app).get("/api/articles?sort_by=key");
      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("Bad Request");
    });
    test("400: when trying to order by an order that doesnt exist", async () => {
      const response = await request(app).get("/api/articles?order=down");
      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("Bad Request");
    });
  });
  describe("GET /api/users/:username", () => {
    test("200: returns a user when passed a valid username", async () => {
      const response = await request(app).get("/api/users/lurker");
      const { user } = response.body;
      expect(response.status).toBe(200);
      expect(typeof user.name).toBe("string");
      expect(typeof user.avatar_url).toBe("string");
      expect(user.username).toBe("lurker");
    });
    test("404: when passed a username that does not exist", async () => {
      const response = await request(app).get("/api/users/rain");
      const { msg } = response.body;
      expect(response.status).toBe(404);
      expect(msg).toBe("Not found");
    });
  });
  describe("PATCH /api/comments/:comment_id", () => {
    test("201: updates the comment when passed a valid body", async () => {
      const response = await request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 1 });
      const { comment } = response.body;
      expect(response.status).toBe(201);
      expect(comment.votes).toBe(17);
    });
    test("400: when trying to update the votes by more than 1", async () => {
      const response = await request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 2 });
      const { msg } = response.body;
      expect(response.status).toBe(400);
      expect(msg).toBe("Bad Request");
    });
    test("400: when trying to update the votes but passing an invalid body", async () => {
      const response = await request(app)
        .patch("/api/comments/1")
        .send({ vote: 1 });
      const { msg } = response.body;
      expect(response.status).toBe(400);
      expect(msg).toBe("Bad Request");
    });
    test("404: when trying to update the votes on a comment that does not exit", async () => {
      const response = await request(app)
        .patch("/api/comments/200")
        .send({ inc_votes: 1 });
      const { msg } = response.body;
      expect(response.status).toBe(404);
      expect(msg).toBe("Not found");
    });
    test("400: when trying to update the votes but passing an invalid comment_id", async () => {
      const response = await request(app)
        .patch("/api/comments/hmm")
        .send({ inc_votes: 1 });
      const { msg } = response.body;
      expect(response.status).toBe(400);
      expect(msg).toBe("Bad Request");
    });
  });
  describe("POST /api/articles", () => {
    test("201: returns the posted article", async () => {
      const response = await request(app).post("/api/articles").send({
        author: "lurker",
        title: "A useless goddess",
        body: "Well should have chosen something better",
        topic: "mitch",
        article_img_url:
          "https://upload.wikimedia.org/wikipedia/en/4/44/Kazuma_Sato.png",
      });
      const { article } = response.body;
      expect(response.status).toBe(201);
      expect(typeof article.article_id).toBe("number");
      expect(typeof article.votes).toBe("number");
      expect(typeof article.comment_count).toBe("number");
      expect(typeof article.created_at).toBe("string");
      expect(article.author).toBe("lurker");
      expect(article.title).toBe("A useless goddess");
      expect(article.body).toBe("Well should have chosen something better");
      expect(article.topic).toBe("mitch");
      expect(article.article_img_url).toBe(
        "https://upload.wikimedia.org/wikipedia/en/4/44/Kazuma_Sato.png"
      );
    });
    test("400: when trying to post a new article whilst sending a body without the required keys", async () => {
      const response = await request(app).post("/api/articles").send({
        author: "lurker",
        title: "A useless goddess",
        body: "Well should have chosen something better",
        article_img_url:
          "https://upload.wikimedia.org/wikipedia/en/4/44/Kazuma_Sato.png",
      });
      const { msg } = response.body;
      expect(response.status).toBe(400);
      expect(msg).toBe("Bad Request");
    });
    test("404: when trying to post a new article whilst sending a body with the required values not in the right data type", async () => {
      const response = await request(app).post("/api/articles").send({
        author: "lurker",
        title: "A useless goddess",
        body: "Well should have chosen something better",
        topic: 55555,
        article_img_url:
          "https://upload.wikimedia.org/wikipedia/en/4/44/Kazuma_Sato.png",
      });
      const { msg } = response.body;
      expect(response.status).toBe(404);
      expect(msg).toBe("Not found");
    });
    test("404: when a user that does not exist is trying to post a new article", async () => {
      const response = await request(app).post("/api/articles").send({
        author: "lee",
        title: "A useless goddess",
        body: "Well should have chosen something better",
        topic: "WORLDS",
        article_img_url:
          "https://upload.wikimedia.org/wikipedia/en/4/44/Kazuma_Sato.png",
      });
      const { msg } = response.body;
      expect(response.status).toBe(404);
      expect(msg).toBe("Not found");
    });
    test("404: when a user is posting an article to a topic that does not exist", async () => {
      const response = await request(app).post("/api/articles").send({
        author: "lurker",
        title: "A useless goddess",
        body: "Well should have chosen something better",
        topic: "WORLDS",
        article_img_url:
          "https://upload.wikimedia.org/wikipedia/en/4/44/Kazuma_Sato.png",
      });
      const { msg } = response.body;
      expect(response.status).toBe(404);
      expect(msg).toBe("Not found");
    });
  });
  describe("GET /users/:username/likes", () => {
    test("200: gets the likes by that user", async () => {
      const response = await request(app).get("/api/users/lurker/likes");
      const { likes } = response.body;
      expect(response.status).toBe(200);
      expect(likes.length).toBe(4);
      likes.forEach((like) => {
        expect(like.username).toBe("lurker");
      });
    });
    test("404: when a user does not exist", async () => {
      const response = await request(app).get("/api/users/lee/likes");
      expect(response.status).toBe(404);
      expect(response.body.msg).toBe("Not found");
    });
    test("200: when there are no likes by the user", async () => {
      test;
    });
  });
  describe("POST /users/:username/likes", () => {
    test("201: posts the likes", async () => {
      const response = await request(app)
        .post("/api/users/lurker/likes")
        .send({ username: "lurker", article_id: 5, likes: -1 });
      const { likes } = response.body;
      expect(response.status).toBe(201);
    });
    test("400: when trying to post likes without the neccessary key value pairs", async () => {
      const response = await request(app)
        .post("/api/users/lurker/likes")
        .send({ username: "lurker", article_id: 5 });
      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("Bad Request");
    });
  });
});
