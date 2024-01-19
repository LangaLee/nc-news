const articleRouter = require("express").Router();
const {
  getArticle,
  getArticleComments,
  addVote,
  postArticleComment,
  getArticles,
} = require("../MVC/controllers/news.controllers");

articleRouter.get("/", getArticles);
articleRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postArticleComment);
articleRouter.route("/:article_id").get(getArticle).patch(addVote);

module.exports = articleRouter;
