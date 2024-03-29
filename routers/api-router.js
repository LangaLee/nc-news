const { getEndpoints } = require("../MVC/controllers/news.controllers");
const articleRouter = require("./articles-router");
const commentRouter = require("./comments-router");
const topicRouter = require("./topics-router");
const userRouter = require("./users-router");
const apiRouter = require("express").Router();

apiRouter.get("/", getEndpoints);
apiRouter.use("/users", userRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/topics", topicRouter);
apiRouter.use("/comments", commentRouter);

module.exports = apiRouter;
