const express = require("express");
const { getTopics } = require("./MVC/controllers/news.controllers");
const app = express();

app.get("/api/topics", getTopics);

app.get("*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});
module.exports = app;
