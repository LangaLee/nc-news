const db = require("../../db/connection");

async function fetchTopics() {
  const data = await db.query(`Select * FROM topics;`);
  return data;
}

module.exports = { fetchTopics };
