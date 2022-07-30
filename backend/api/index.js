import express from "express";

import {
  rootRoutes,
  airportRoutes,
  airlineRoutes,
  planeRoutes,
  routeRoutes,
  flightRoutes,
  userRoutes,
  bookingRoutes,
  webhookRoutes,
  bullBoardRoutes,
} from "./routes/index.js";

import bodyParser from "body-parser";
import { logger } from "../utils/index.js";
import cors from "cors";
import config from "../config/index.js";
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware.js";

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
app.use("/api", rootRoutes);
app.use("/api/planes", planeRoutes);
app.use("/api/airlines", airlineRoutes);
app.use("/api/airports", airportRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/user", userRoutes);
app.use("/admin/queues", bullBoardRoutes);

// ---------- THIS MUST BE LAST DO NOT TOUCH  ----------
app.use(errorHandlerMiddleware);

export default app;
