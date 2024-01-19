const {
  deleteComment,
  updateCommentVotes,
} = require("../MVC/controllers/comments.controllers");

const commentRouter = require("express").Router();

commentRouter
  .route("/:comment_id")
  .delete(deleteComment)
  .patch(updateCommentVotes);

module.exports = commentRouter;
