const db = require("../../db/connection");

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

async function changeCommentVotes(id, votes) {
  const comment = await db.query(
    `SELECT * FROM comments WHERE comment_id = $1`,
    [id]
  );
  if (comment.rows[0] === undefined) return Promise.reject({ status: 404 });
  if (votes === 1 || votes === -1) {
    const comment = await db.query(
      `UPDATE comments SET votes = votes + $2 WHERE comment_id = $1 RETURNING *`,
      [id, votes]
    );
    return comment.rows[0];
  } else return Promise.reject("400");
}

module.exports = { removeComment, changeCommentVotes };
