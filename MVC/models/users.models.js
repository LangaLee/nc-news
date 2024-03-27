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

async function fetchLikesByUsername(username, id) {
  const data = await db.query(
    `SELECT * FROM likes WHERE username = $1 AND article_id = $2`,
    [username, id]
  );
  const likes = data.rows[0];
  return likes;
}

async function postUserLikes(likes) {
  const data = await db.query(
    format(`INSERT INTO likes (username, article_id, likes) VALUES %L;`, [
      [likes.username, likes.article_id, likes.likes],
    ])
  );
}

async function changeUserLikes(username, id, value) {
  const data = await db.query(
    `UPDATE likes SET likes = $1 WHERE username = $2 AND article_id = $3 RETURNING *;`,
    [value.likes, username, id]
  );
  return data.rows[0];
}

async function addUser(user) {
  if (
    typeof user.username !== "string" ||
    typeof user.name !== "string" ||
    typeof user.avatar_url !== "string"
  ) {
    return Promise.reject({ status: 400 });
  }
  const data = Object.keys(user).map((key) => user[key]);
  const userExists = await db.query(`SELECT * FROM users WHERE username = $1`, [
    user.username,
  ]);
  if (userExists.rows.length > 0) return Promise.reject({ status: 400 });
  await db.query(
    format(`INSERT INTO users (username, name, avatar_url) VALUES %L;`, [data])
  );
}

module.exports = {
  fetchUsers,
  fetchUserByUserName,
  fetchLikesByUsername,
  postUserLikes,
  changeUserLikes,
  addUser,
};
