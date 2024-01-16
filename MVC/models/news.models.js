const db = require("../../db/connection");
const { formatArticles } = require("../../utils/model.utils");
async function fetchTopics() {
  const data = await db.query(`Select * FROM topics`);
  return data;
}

// fix this for SQL injection
async function fetchArticle(id) {
  const data = await db.query(`SELECT * FROM articles 
  WHERE article_id = ${id}
  `);
  if (data.rows.length === 0)
    return Promise.reject({ status: 404, msg: "Not found" });
  return data;
}

async function fetchArticles() {
  const articles = await db.query(`SELECT * FROM articles 
    ORDER BY created_at DESC
  `);
  const comments = await db.query(`SELECT * FROM comments`);
  return formatArticles(articles.rows, comments.rows);
}

module.exports = { fetchTopics, fetchArticle, fetchArticles };
