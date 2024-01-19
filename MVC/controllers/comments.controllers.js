const {
  removeComment,
  changeCommentVotes,
} = require("../models/comments.models");

async function deleteComment(req, res, next) {
  try {
    const { comment_id } = req.params;
    await removeComment(comment_id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function updateCommentVotes(req, res, next) {
  try {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    const comment = await changeCommentVotes(comment_id, inc_votes);
    res.status(201).send({ comment });
  } catch (error) {
    next(error);
  }
}

module.exports = { deleteComment, updateCommentVotes };
