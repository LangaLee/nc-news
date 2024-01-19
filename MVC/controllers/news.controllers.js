const { fetchTopics, fetchEndpoints } = require("../models/news.models");

async function getTopics(req, res, next) {
  try {
    const topics = await fetchTopics();
    res.status(200).send({ topics });
  } catch (error) {
    next(error);
  }
}

async function getEndpoints(req, res, next) {
  const endpoints = await fetchEndpoints();
  res.status(200).send({ endpoints });
}

module.exports = {
  getTopics,
  getEndpoints,
};
