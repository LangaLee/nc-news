const {
  fetchTopics,
  fetchArticle,
  fetchArticles,
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
    res.status(200).send({ article: data.rows[0] });
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
module.exports = { getTopics, getArticle, getArticles };
