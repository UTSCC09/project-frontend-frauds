const express = require("express");
const config = require("./config");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

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
app.listen(config.SERVER_PORT, async () => {
  // connect to mongo db
  await mongoose.connect(config.MONGO_DB_URI, {
    dbName: config.MONGO_DB_DATABASE,
  });

  console.log(`Server listening on port ${config.SERVER_PORT}`);
});
