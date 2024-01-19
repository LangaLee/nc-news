const { fetchUsers, fetchUserByUserName } = require("../models/users.models");

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

module.exports = { getUsers, getUserByUsername };
