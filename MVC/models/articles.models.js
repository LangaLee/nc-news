const db = require("../../db/connection");
const { articleData } = require("../../db/data/test-data");
const { formatArticles } = require("../../utils/model.utils");
const format = require("pg-format");

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

async function fetchArticles(topic, sort_by, order) {
  let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
  COUNT(comments.comment_id) ::INT AS comment_count 
  FROM articles 
  LEFT JOIN comments ON comments.article_id = articles.article_id`;
  const orderValues = ["ASC", "DESC"];
  const sortValues = [
    "AUTHOR",
    "ARTICLE_ID",
    "TOPIC",
    "TITLE",
    "VOTES",
    "COMMENT_COUNT",
    "CREATED_AT",
  ];
  const queryValue = [];

  //check if topic exists
  if (topic !== undefined && topic.length !== 0) {
    const data = await db.query(`SELECT * FROM topics WHERE slug = $1`, [
      topic,
    ]);
    // if topic is not there reject the promise
    if (data.rows.length === 0) return Promise.reject({ status: 404 });
    queryStr += ` WHERE topic = $1`;
    queryValue.push(topic);
  }

  queryStr += ` GROUP BY articles.article_id`;

  if (sort_by !== undefined && sortValues.includes(sort_by.toUpperCase())) {
    queryStr += ` ORDER BY ${sort_by}`;
  } else if (sort_by !== undefined && !sortValues.includes(sort_by)) {
    return Promise.reject({ status: 400 });
  } else queryStr += ` ORDER BY created_at`;

  if (order !== undefined && orderValues.includes(order.toUpperCase())) {
    queryStr += ` ${order}`;
  } else if (order !== undefined && !orderValues.includes(order)) {
    return Promise.reject({ status: 400 });
  } else queryStr += ` DESC`;

  const articles = await db.query(queryStr, queryValue);
  return articles.rows;
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
  // if (
  //   typeof comment.username !== "string" ||
  //   typeof comment.body !== "string"
  // ) {
  //   return Promise.reject({ status: 400 });
  // }
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
  // if (typeof id !== "number") return Promise.reject({status: 400});
  await fetchArticle(id);
  // if (!votes.hasOwnProperty("inc_votes") || typeof votes.inc_votes !== "number")
  //   return Promise.reject({ status: 400 });
  const article = await db.query(
    `UPDATE articles SET votes = votes + $1 
  WHERE article_id = $2 RETURNING * 
    `,
    [votes.inc_votes, id]
  );
  return article.rows[0];
}

async function addArticle(data) {
  const values = [[data.author, data.title, data.body, data.topic]];
  let img_url = "";
  if (data.article_img_url !== undefined) {
    values[0].push(data.article_img_url);
    img_url += ", article_img_url";
  }
  const input = await db.query(
    format(
      `INSERT INTO articles (author, title, body, topic ${img_url} )  VALUES %L RETURNING *`,
      values
    )
  );
  const id = input.rows[0].article_id;
  const article = await fetchArticle(id, { comment_count: "" });
  return article;
}

module.exports = {
  fetchArticleComments,
  addArticleComment,
  updateVote,
  fetchArticle,
  fetchArticles,
  fetchArticle,
  fetchArticles,
  addArticle,
};
