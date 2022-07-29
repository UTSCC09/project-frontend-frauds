import express from "express";
import passport from "passport";
import { strategy } from "../helpers/index.js";
import user from "../../models/user.js";
import asyncHandler from "express-async-handler";

const router = express.Router();
strategy();

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

router.post(
  "/testUserDBCreate",
  asyncHandler(async(req, res, next) => {
    const {email, name, role} = req.body;
    const {firstName, middleName, lastName } = name;
    res.json(
      await user.insertUser(email, {firstName, middleName, lastName}, role)
    );
  })
);
router.post(
  "/testUserDBUpdateRole",
  asyncHandler(async(req, res, next) => {
    const {email, role} = req.body;
    res.json(
      await user.updateRole(email, role)
    );
  })
);

router.get(
  "/google/signin",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/google/success",
    failureRedirect: "/auth/google/failure",
  })
);

router.get("/google/success", isLoggedIn, (req, res) => {
  console.log(req.user);
  res.send(
    "hello " +
      req.user.displayName +
      ", your email is: " +
      req.user.emails[0].value
  );
});

router.get("/google/failure", isLoggedIn, (req, res) => {
  res.sendStatus(401);
});

router.get("/google/signout", (req, res) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy();
    res.redirect("/");
  });
});

export default router;
