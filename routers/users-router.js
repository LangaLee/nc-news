const {
  getUsers,
  getUserByUsername,
  getUserLikes,
  addUserLikes,
} = require("../MVC/controllers/users.controllers");
const userRouter = require("express").Router();

userRouter.get("/", getUsers);
userRouter.get("/:username", getUserByUsername);
userRouter.route("/:username/likes").get(getUserLikes).post(addUserLikes);

module.exports = userRouter;
