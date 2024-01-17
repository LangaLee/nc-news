const express = require("express");
const {
  getTopics,
  getArticle,
  getArticles,
  getEndpoints,
  getArticleComments,
  postArticleComment,
} = require("./MVC/controllers/news.controllers");
const app = express();

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postArticleComment);

app.get("*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

app.use((error, req, res, next) => {
  if (error.status === 404) {
    res.status(error.status).send({ msg: error.msg });
  }
  next(error);
});
app.use((error, req, res, next) => {
  if (
    error.code === "42703" ||
    error.code === "22P02" ||
    error === "400" ||
    error.code === "23503"
  ) {
    res.status(400).send({ msg: "Bad Request" });
  }
});
module.exports = app;
