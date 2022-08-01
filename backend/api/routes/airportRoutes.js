import express from "express";
import { Airport } from "../../models/index.js";
import { checkSchema } from "express-validator";
import { searchValidator } from "../validators/index.js";
import validateSchema from "../middlewares/validateSchemaMiddleware.js";
import asyncHandler from "express-async-handler";
import {
  authorizeAccessToken,
  authorizeRole,
} from "../middlewares/validateTokenMiddleware.js";

const router = express.Router();

// search
router.post(
  "/search",
  authorizeAccessToken,
  authorizeRole(["user"]),
  checkSchema(searchValidator),
  validateSchema,
  asyncHandler(async ({ body, query }, res) => {
    res.json(
      await Airport.search(body.query, body.include, body.exclude, query.limit)
    );
  })
);

export default router;
