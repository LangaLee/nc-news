const articleRouter = require("express").Router();
const {
  getArticle,
  getArticleComments,
  addVote,
  postArticleComment,
  getArticles,
  postArticle,
} = require("../MVC/controllers/articles.controllers");

articleRouter.route("/").get(getArticles).post(postArticle);
articleRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postArticleComment);
articleRouter.route("/:article_id").get(getArticle).patch(addVote);

module.exports = articleRouter;
