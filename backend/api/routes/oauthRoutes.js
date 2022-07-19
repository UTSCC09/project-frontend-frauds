import express from "express";
import passport from "passport";
import { strategy } from "../helpers/index.js";

const router = express.Router();
strategy();

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

router.get(
  "/google/signin",
  (req, _res, next) => {
    req.register = false;
    next();
  },
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/signup",
  (req, _res, next) => {
    req.body.register = true;
    console.log("I am in the middleware " + req.body.register);
    next();
  },
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
  res.send("hello " + req.user.emails[0].value);
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
