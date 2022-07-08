import express from "express";
import { Airport } from "../../models/index.js";
import { checkSchema, validationResult } from "express-validator";
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
      await Airport.search(body.query, body.match, body.include, body.exclude)
    );
  }
);

export default router;
