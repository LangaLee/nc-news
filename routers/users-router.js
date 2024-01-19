const {
  getUsers,
  getUserByUsername,
} = require("../MVC/controllers/users.controllers");
const userRouter = require("express").Router();

userRouter.get("/", getUsers);
userRouter.get("/:username", getUserByUsername);

module.exports = userRouter;
