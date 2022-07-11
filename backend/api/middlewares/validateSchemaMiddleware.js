import { validationResult } from "express-validator";

export default function (req, res, next) {
  // SOURCE: https://stackoverflow.com/questions/70688224/express-validator-checkschema-not-raise-errors
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  res.status(400).json({ errors: errors.array() });
}
