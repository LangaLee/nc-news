const db = require("../../db/connection");
const { formatArticles } = require("../../utils/model.utils");
const fs = require("fs/promises");
const format = require("pg-format");

async function fetchTopics() {
  const data = await db.query(`Select * FROM topics`);
  return data;
}

async function fetchArticle(id) {
  const data = await db.query(`SELECT * FROM articles 
  WHERE article_id = ${id}
  `);
  if (data.rows.length === 0)
    return Promise.reject({ status: 404, msg: "Not found" });
  return data.rows[0];
}

async function fetchArticles() {
  const articles = await db.query(`SELECT * FROM articles 
    ORDER BY created_at DESC
  `);
  const comments = await db.query(`SELECT * FROM comments`);
  return formatArticles(articles.rows, comments.rows);
}

async function fetchEndpoints() {
  const endpoints = await fs.readFile(
    "/home/lee/Documents/be-nc-news/MVC/models/../../endpoints.json",
    "utf-8"
  );
  return JSON.parse(endpoints);
}

async function fetchArticleComments(id) {
  const comments = await db.query(
    `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
    [id]
  );
  const article = await fetchArticle(id);
  return Promise.all([comments, article]);
}

async function addArticleComment(id, comment) {
  await fetchArticle(id);
  await db.query(`SELECT * FROM users WHERE username = $1`, [comment.username]);
  if (
    typeof comment.username !== "string" ||
    typeof comment.body !== "string"
  ) {
    return Promise.reject("400");
  }
  const response = await db.query(
    format(
      `INSERT INTO comments (body, author, article_id, votes) VALUES %L RETURNING *;
    `,
      [[comment.body, comment.username, id, 0]]
    )
  );
  return response.rows[0];
}

module.exports = {
  fetchTopics,
  fetchArticle,
  fetchArticles,
  fetchEndpoints,
  fetchArticleComments,
  addArticleComment,
};
