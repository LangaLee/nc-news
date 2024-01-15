const db = require("../../db/connection");

async function fetchTopics() {
  const data = await db.query(`Select * FROM topics;`);
  return data;
}

async function fetchArticle(id) {
  const data = await db.query(`SELECT * FROM articles 
  WHERE article_id = ${id}
  `);
  if (data.rows.length === 0)
    return Promise.reject({ status: 404, msg: "Not found" });
  return data;
}

module.exports = { fetchTopics, fetchArticle };
