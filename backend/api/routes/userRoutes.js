import express from "express";
import asyncHandler from "express-async-handler";
import User from "../../models/user.js";

const router = express.Router();

router.post(
  "/",
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
  asyncHandler(async (req, res, next) => {
    const { email, role } = req.body;
    res.json(await User.updateRole(email, role));
  })
);
router.post(
  "/search",
  asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    res.json(await User.findUser(email));
  })
);

export default router;
