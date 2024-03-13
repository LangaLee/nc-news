const {
  fetchUsers,
  fetchUserByUserName,
  fetchLikesByUsername,
  postUserLikes,
} = require("../models/users.models");

async function getUsers(req, res, next) {
  try {
    const users = await fetchUsers();
    res.status(200).send({ users });
  } catch (error) {
    console.log(error);
  }
}

async function getUserByUsername(req, res, next) {
  try {
    const { username } = req.params;
    const user = await fetchUserByUserName(username);
    res.status(200).send({ user });
  } catch (error) {
    next(error);
  }
}

async function getUserLikes(req, res, next) {
  try {
    const { username } = req.params;
    const { article_id } = req.params;
    const promises = await Promise.all([
      fetchUserByUserName(username),
      fetchLikesByUsername(username, article_id),
    ]);
    res.status(200).send({ likes: promises[1] });
  } catch (error) {
    next(error);
  }
}

async function addUserLikes(req, res, next) {
  try {
    const { username } = req.params;
    const likes = req.body;
    const promises = await Promise.all([
      fetchUserByUserName(username),
      postUserLikes(likes),
    ]);
    res.status(201).send({});
  } catch (error) {
    next(error);
  }
}

module.exports = { getUsers, getUserByUsername, getUserLikes, addUserLikes };
