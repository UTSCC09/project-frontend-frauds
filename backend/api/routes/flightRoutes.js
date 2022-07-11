import express from "express";
import { Flight } from "../../models/index.js";
import { checkSchema } from "express-validator";
import { flightValidator } from "../validators/index.js";
import validateSchema from "../middlewares/validateSchemaMiddleware.js";

const router = express.Router();

// search
router.post(
  "/flight",
  checkSchema(flightValidator),
  validateSchema,
  async ({ body }, res) => {
    await Flight.addFlight(
      body.routeId,
      body.planeId,
      body.departureTime,
      body.arrivalTime,
      body.duration,
      body.price
    );
    res.json({ message: "flight added to system" });
  }
);

export default router;
