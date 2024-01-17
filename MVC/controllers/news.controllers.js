const {
  fetchTopics,
  fetchArticle,
  fetchArticles,
  fetchEndpoints,
  fetchArticleComments,
  addArticleComment,
} = require("../models/news.models");

async function getTopics(req, res, next) {
  try {
    const data = await fetchTopics();
    res.status(200).send({ topics: data.rows });
  } catch (error) {}
}

async function getArticle(req, res, next) {
  try {
    const { article_id } = req.params;

    const data = await fetchArticle(article_id);
    res.status(200).send({ article: data });
  } catch (error) {
    next(error);
  }
}

async function getArticles(req, res, next) {
  try {
    const articles = await fetchArticles();
    res.status(200).send({ articles });
  } catch (error) {
    next(error);
  }
}

async function getEndpoints(req, res, next) {
  const endpoints = await fetchEndpoints();
  res.status(200).send({ endpoints });
}

async function getArticleComments(req, res, next) {
  try {
    const { article_id } = req.params;
    const comments = await fetchArticleComments(article_id);
    res.status(200).send({ comments: comments[0].rows });
  } catch (error) {
    next(error);
  }
}

async function postArticleComment(req, res, next) {
  try {
    const { article_id } = req.params;
    const commentToAdd = req.body;
    const comment = await addArticleComment(article_id, commentToAdd);
    res.status(202).send({ comment });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTopics,
  getArticle,
  getArticles,
  getEndpoints,
  getArticleComments,
  postArticleComment,
};
