const express = require("express");
const config = require("./app-config.js");
const bodyParser = require("body-parser");

// express apps
const app = express();

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(({ method, url, body }, _res, next) => {
  console.log("[HTTP REQUEST]", method, url, body);
  next();
});

app.get("/health", (_req, res) => {
  res.json({ message: "ok" });
});

// start server
app.listen(config.SERVER_PORT, () => {
  console.log(`Example app listening on port ${config.SERVER_PORT}`);
});
