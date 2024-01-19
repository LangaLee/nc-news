const {
  fetchTopics,
  fetchArticle,
  fetchArticles,
  fetchEndpoints,
  fetchArticleComments,
  addArticleComment,
  updateVote,
  removeComment,
} = require("../models/news.models");

async function getTopics(req, res, next) {
  try {
    const topics = await fetchTopics();
    res.status(200).send({ topics });
  } catch (error) {
    next(error);
  }
}

async function getArticle(req, res, next) {
  try {
    const { article_id } = req.params;
    const query = req.query;
    const article = await fetchArticle(article_id, query);
    res.status(200).send({ article });
  } catch (error) {
    next(error);
  }
}

async function getArticles(req, res, next) {
  try {
    const { topic } = req.query;
    const { sort_by } = req.query;
    const { order } = req.query;
    const articles = await fetchArticles(topic, sort_by, order);
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
    res.status(201).send({ comment });
  } catch (error) {
    next(error);
  }
}

async function addVote(req, res, next) {
  try {
    const { article_id } = req.params;
    const votes = req.body;
    const article = await updateVote(article_id, votes);
    res.status(200).send({ article });
  } catch (error) {
    next(error);
  }
}

async function deleteComment(req, res, next) {
  try {
    const { comment_id } = req.params;
    await removeComment(comment_id);
    res.status(204).send();
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
  addVote,
  deleteComment,
};
