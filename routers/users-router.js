const {
  getUsers,
  getUserByUsername,
  getUserLikes,
  addUserLikes,
  updateUserLikes,
} = require("../MVC/controllers/users.controllers");
const userRouter = require("express").Router();

userRouter.get("/", getUsers);
userRouter.get("/:username", getUserByUsername);
userRouter
  .route("/:username/:article_id/likes")
  .get(getUserLikes)
  .patch(updateUserLikes);
userRouter.route("/:username/likes").post(addUserLikes);

module.exports = userRouter;
