const db = require("../../db/connection");
const format = require("pg-format");
async function fetchUsers() {
  const userData = await db.query(`SELECT * FROM users`);
  return userData.rows;
}

async function fetchUserByUserName(username) {
  const data = await db.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);
  const user = data.rows[0];
  if (user === undefined) return Promise.reject({ status: 404 });
  return user;
}

async function fetchLikesByUsername(username) {
  const data = await db.query(`SELECT * FROM likes WHERE username = $1`, [
    username,
  ]);
  const likes = data.rows;
  return likes;
}

async function postUserLikes(likes) {
  const data = await db.query(
    format(`INSERT INTO likes (username, article_id, likes) VALUES %L;`, [
      [likes.username, likes.article_id, likes.likes],
    ])
  );
}

module.exports = {
  fetchUsers,
  fetchUserByUserName,
  fetchLikesByUsername,
  postUserLikes,
};
