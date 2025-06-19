const express = require("express");
const connectDb = require("./db/db");
const userRouter = require("./router/router");
const postRouter = require("./router/post.routes");
const adminRouter = require("./router/admin.routes");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const remindInactiveUsers = require("./reminder/reminder");
const deleteInactiveUsers = require("./scheduler/scheduler");

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft- 7",
  legacyHeaders: false,
});
app.use(limiter);
app.use(helmet());

remindInactiveUsers();
deleteInactiveUsers();

app.use("/v1/user", userRouter);
app.use("/v1/post", postRouter);
app.use("/v1/admin", adminRouter);

app.use((req, res) => {
  return res
    .status(404)
    .json({
      message: `The resourse with the url::: ${req.originalUrl} does not exist`,
    });
});
app.listen(port, () => console.log(`Listening to requests on port ${port}`));

connectDb();
