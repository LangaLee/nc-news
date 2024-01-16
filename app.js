const express = require("express");
const {
  getTopics,
  getArticle,
  getArticles,
} = require("./MVC/controllers/news.controllers");
const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles", getArticles);

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
  if (error.code === "42703") {
    res.status(400).send({ msg: "Bad Request" });
  }
});
module.exports = app;
