import express from "express";
import asyncHandler from "express-async-handler";

const router = express.Router();

router.get(
  "/health",
  asyncHandler(async (_req, res) => {
    res.json({ message: "ok" });
  })
);

export default router;
