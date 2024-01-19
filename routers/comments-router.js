const { deleteComment } = require("../MVC/controllers/news.controllers");

const commentRouter = require("express").Router();

commentRouter.delete("/:comment_id", deleteComment);

module.exports = commentRouter;
