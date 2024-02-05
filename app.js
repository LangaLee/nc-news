const express = require("express");
const {
  getTopics,
  getArticle,
  getArticles,
  getEndpoints,
  getArticleComments,
  postArticleComment,
  addVote,
  deleteComment,
  getUsers,
} = require("./MVC/controllers/news.controllers");

const cors = require("cors");

const apiRouter = require("./routers/api-router");
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.get("*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

app.use((error, req, res, next) => {
  if (error.status === 404 || error.code === "23503") {
    res.status(404).send({ msg: "Not found" });
  }
  next(error);
});
app.use((error, req, res, next) => {
  if (
    error.code === "42703" ||
    error.code === "23502" ||
    error.code === "22P02" ||
    error === "400"
  ) {
    res.status(400).send({ msg: "Bad Request" });
  }
});

module.exports = app;
