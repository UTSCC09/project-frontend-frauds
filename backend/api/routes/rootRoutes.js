import express from "express";
import {
  Airline,
  Airport,
  Country,
  Plane,
  Route,
} from "../../models/index.js";

const router = express.Router();

router.get("/health", (_req, res) => {
  res.json({ message: "ok" });
});

/* TODO: Remove eventually */
router.get("/airline", async (_req, res) => {
  res.json(await Airline.paginate());
});

router.get("/airport", async (_req, res) => {
  res.json(await Airport.paginate());
});

router.get("/country", async (_req, res) => {
  res.json(await Country.paginate());
});

router.get("/plane", async (_req, res) => {
  res.json(await Plane.paginate());
});

router.get("/route", async (_req, res) => {
  res.json(await Route.paginate());
});

export default router;
