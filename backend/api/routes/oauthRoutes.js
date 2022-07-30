import express from "express";
import user from "../../models/user.js";
import asyncHandler from "express-async-handler";

const router = express.Router();

router.post(
  "/testUserDBCreate",
  asyncHandler(async (req, res, next) => {
    const { email, name, role } = req.body;
    const { firstName, middleName, lastName } = name;
    res.json(
      await user.insertUser(email, { firstName, middleName, lastName }, role)
    );
  })
);
router.post(
  "/testUserDBUpdateRole",
  asyncHandler(async (req, res, next) => {
    const { email, role } = req.body;
    res.json(await user.updateRole(email, role));
  })
);
router.post(
  "/testUserDBGetUserByEmail",
  asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    res.json(await user.findUser(email));
  })
);

export default router;
