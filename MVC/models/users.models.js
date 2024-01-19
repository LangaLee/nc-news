const db = require("../../db/connection");

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

module.exports = { fetchUsers, fetchUserByUserName };
