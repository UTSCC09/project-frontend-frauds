import app from "./api/index.js";
import config from "./config/index.js";
import mongoose from "mongoose";
import { logger } from "./utils/index.js";

// start server
app.listen(config.SERVER_PORT, async () => {
  logger.info("Initiating database connection");

  // connect to mongo db
  await mongoose.connect(config.MONGO_DB_URI, {
    dbName: config.MONGO_DB_DATABASE,
  });

  logger.info("Connected to database");
  logger.info(`Server listening on port ${config.SERVER_PORT}`);
});
