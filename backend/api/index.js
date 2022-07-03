import express from "express";
import rootRoutes from "./routes/root.js";
import airportRoutes from "./routes/airports.js";
import bodyParser from "body-parser";
import logger from "../utils/index.js";
import cors from "cors";

const app = express();

// register middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(({ method, url, body }, _res, next) => {
  logger.info(`${method} ${url} ${JSON.stringify(body)}`);
  next();
});

// register routes
app.use(rootRoutes);
app.use("/airports", airportRoutes);

export default app;
