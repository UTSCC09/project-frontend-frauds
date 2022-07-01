import app from "./api/index.js";
import config from "./config/index.js";
import bodyParser from "body-parser";
import mongoose from "mongoose";

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(({ method, url, body }, _res, next) => {
  console.log("[HTTP REQUEST]", method, url, body);
  next();
});

// start server
app.listen(config.SERVER_PORT, async () => {
  // connect to mongo db
  await mongoose.connect(config.MONGO_DB_URI, {
    dbName: config.MONGO_DB_DATABASE,
  });

  console.log(`Server listening on port ${config.SERVER_PORT}`);
});
