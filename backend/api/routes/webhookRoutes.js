import express from "express";
import { Flight } from "../../models/index.js";
import { checkSchema } from "express-validator";
import { webhookValidator } from "../validators/index.js";
import validateSchema from "../middlewares/validateSchemaMiddleware.js";
import asyncHandler from "express-async-handler";
import {
  authorizeAccessToken,
  authorizeRole,
} from "../middlewares/validateTokenMiddleware.js";

const router = express.Router();

// POST: Subscribe to webhook
router.post(
  "/flights/:id",
  authorizeAccessToken,
  authorizeRole(["user"]),
  checkSchema(webhookValidator),
  validateSchema,
  asyncHandler(async ({ body, params }, res) => {
    const { event, callbackURL } = body;
    const { id } = params;

    // subscribe to webhook
    await Flight.subscribeWebhook(event, callbackURL, "payamyek@gmail.com", id);

    // send back response
    res.json({ message: "Successfully subscribed to webhook event" });
  })
);

// DELETE: Subscribe to webhook
router.delete(
  "/flights/:id",
  authorizeAccessToken,
  authorizeRole(["user"]),
  checkSchema(webhookValidator),
  validateSchema,
  asyncHandler(async ({ body, params }, res) => {
    const { event, callbackURL } = body;
    const { id } = params;

    // subscribe to webhook
    await Flight.unsubscribeWebhook(
      event,
      callbackURL,
      "payamyek@gmail.com",
      id
    );

    // send back response
    res.json({ message: "Successfully unsubscribed to webhook event" });
  })
);

export default router;
