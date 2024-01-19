const db = require("../../db/connection");
const fs = require("fs/promises");
const format = require("pg-format");

async function fetchTopics() {
  const data = await db.query(`Select * FROM topics`);
  return data.rows;
}

async function fetchEndpoints() {
  const filePath = __dirname;
  const endpoints = await fs.readFile(
    `${filePath}/../../endpoints.json`,
    "utf-8"
  );
  return JSON.parse(endpoints);
}

module.exports = {
  fetchTopics,
  fetchEndpoints,
};
