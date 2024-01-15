const { fetchTopics } = require("../models/news.models");

async function getTopics(req, res, next) {
  try {
    const data = await fetchTopics();
    res.status(200).send({ topics: data.rows });
  } catch (error) {}
}

module.exports = { getTopics };
