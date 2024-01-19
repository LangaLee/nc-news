const { getTopics } = require("../MVC/controllers/news.controllers");

const topicRouter = require("express").Router();

topicRouter.get("/", getTopics);

module.exports = topicRouter;
