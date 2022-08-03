import express from "express";
import asyncHandler from "express-async-handler";
import User from "../../models/user.js";
import {
  authorizeAccessToken,
  authorizeRole,
} from "../middlewares/validateTokenMiddleware.js";
import createError from "http-errors";

const router = express.Router();

router.post(
  "/",
  authorizeAccessToken,
  asyncHandler(async (req, res, next) => {
    const { email, name, role } = req.body;
    const { firstName, middleName, lastName } = name;
    res.json(
      await User.insertUser(email, { firstName, middleName, lastName }, role)
    );
  })
);
router.patch(
  "/",
  authorizeAccessToken,
  authorizeRole(["user"]),
  asyncHandler(async (req, res, next) => {
    const { email, role } = req.body;
    res.json(await User.updateRole(req.auth.email, role));
  })
);
router.post(
  "/search",
  authorizeAccessToken,
  authorizeRole(["user"]),
  asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    res.json(await User.findUser(email));
  })
);

export default router;
