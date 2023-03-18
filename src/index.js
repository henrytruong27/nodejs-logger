const dotenv = require("dotenv");
const express = require("express");
const { logger, generateLMID } = require("./utils/logger");
const session = require("express-session");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use(
  session({
    secret: process.env.SECRET_SESSION_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  if (!req.session.lmid) {
    req.session.lmid = generateLMID();
  }
  req.lmid = req.session.lmid;
  next();
});

dotenv.config();

app.get("/", (req, res) => {
  logger.info(`[${req.lmid}] This is a log message 1`);
  res.json({ hello: "Hello world!" });
});

app.get("/abc", (req, res) => {
  logger.info(`[${req.lmid}] This is a log message 2`);
  res.json({ ok: "ok" });
});

app.get("/check-session", (req, res) => {
  res.send(req.session);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
