import express from "express";

import {
  rootRoutes,
  airportRoutes,
  airlineRoutes,
  planeRoutes,
  routeRoutes,
  flightRoutes,
  oauthRoutes,
} from "./routes/index.js";

import bodyParser from "body-parser";
import { logger } from "../utils/index.js";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import config from "../config/index.js";

const app = express();

// register middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(({ method, url, body }, _res, next) => {
  logger.info(`${method} ${url} ${JSON.stringify(body)}`);
  next();
});
app.use(
  session({
    secret: config.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// register oauth
app.use("/auth", oauthRoutes);

// register routes
app.use("/api", rootRoutes);
app.use("/api/planes", planeRoutes);
app.use("/api/airlines", airlineRoutes);
app.use("/api/airports", airportRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/flights", flightRoutes);

export default app;
