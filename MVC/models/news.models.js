const db = require("../../db/connection");
const { formatArticles } = require("../../utils/model.utils");
const fs = require("fs/promises");
const format = require("pg-format");

async function fetchTopics() {
  const data = await db.query(`Select * FROM topics`);
  return data;
}

async function fetchArticle(id, query) {
  const data = await db.query(
    `SELECT * FROM articles 
  WHERE article_id = $1
  `,
    [id]
  );
  if (data.rows.length === 0)
    return Promise.reject({ status: 404, msg: "Not found" });

  const article = data.rows[0];
  if (query !== undefined && Object.keys(query).length !== 0) {
    const comments = await db.query(
      `SELECT * FROM comments WHERE article_id = $1`,
      [id]
    );
    const articleCopy = JSON.parse(JSON.stringify(article));
    articleCopy.comment_count = comments.rows.length;
    return articleCopy;
  }

  return article;
}

async function fetchArticles(query) {
  let queryStr = `SELECT * FROM articles`;

  const queryValue = [];

  if (query !== undefined && query.length !== 0) {
    queryStr += ` WHERE topic = $1`;
    queryValue.push(query);
  }
  queryStr += ` ORDER BY created_at DESC`;

  const articles = await db.query(queryStr, queryValue);

  const comments = await db.query(`SELECT * FROM comments`);
  return formatArticles(articles.rows, comments.rows);
}

async function fetchEndpoints() {
  const endpoints = await fs.readFile(
    "/home/lee/Documents/nc-news/MVC/models/../../endpoints.json",
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

async function updateVote(id, votes) {
  // if (typeof id !== "number") return Promise.reject("400");
  await fetchArticle(id);
  if (!votes.hasOwnProperty("inc_votes") || typeof votes.inc_votes !== "number")
    return Promise.reject("400");
  const article = await db.query(
    `UPDATE articles SET votes = votes + $1 
WHERE article_id = $2 RETURNING * 
  `,
    [votes.inc_votes, id]
  );
  return article.rows[0];
}

async function removeComment(id) {
  const comment = await db.query(
    `SELECT * FROM comments WHERE comment_id = $1`,
    [id]
  );
  if (comment.rows[0] === undefined)
    return Promise.reject({ status: 404, msg: "Not found" });
  await db.query(`DELETE FROM comments WHERE comment_id = $1`, [id]);
  return;
}

async function fetchUsers() {
  const userData = await db.query(`SELECT * FROM users`);
  return userData.rows;
}

module.exports = {
  fetchTopics,
  fetchArticle,
  fetchArticles,
  fetchEndpoints,
  fetchArticleComments,
  addArticleComment,
  updateVote,
  removeComment,
  fetchUsers,
};
