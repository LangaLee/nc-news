const {
  getUsers,
  getUserByUsername,
  getUserLikes,
  addUserLikes,
  updateUserLikes,
  postUser,
} = require("../MVC/controllers/users.controllers");
const userRouter = require("express").Router();

userRouter.route("/").get(getUsers).post(postUser);
userRouter.get("/:username", getUserByUsername);
userRouter
  .route("/:username/:article_id/likes")
  .get(getUserLikes)
  .patch(updateUserLikes);
userRouter.route("/:username/likes").post(addUserLikes);

module.exports = userRouter;
