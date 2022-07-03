import express from "express";
import { Airport } from "../../models/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { name } = req.query;
  res.json(await Airport.search(name));
});

export default router;
