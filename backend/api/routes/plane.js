import express from "express";
import { Plane } from "../../models/index.js";
import { checkSchema } from "express-validator";
import { searchSchema } from "../validators/search.js";
import validateSchema from "../middlewares/validateSchema.js";

const router = express.Router();

// search
router.post(
  "/search",
  checkSchema(searchSchema),
  validateSchema,
  async ({ body }, res) => {
    res.json(
      await Plane.search(body.query, body.match, body.include, body.exclude)
    );
  }
);

export default router;
