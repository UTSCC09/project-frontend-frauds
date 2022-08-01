import {expressjwt} from "express-jwt";
import jwksRsa from "jwks-rsa";
import config from "../../config/index.js";
import User from "../../models/user.js";

const authorizeAccessToken = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${config.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: config.AUTH0_AUDIENCE,
  issuer: `https://${config.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"]
});

const authorizeRole = (roles) => {
  return async (req, res, next) => {
    // logic
    // notice u have access to roles object here
    if (req.auth.email !== null){
      console.log(req.auth.email);
      console.log(roles);
      const user = await User.findUser(req.auth.email);
      console.log(user);
      if (user?.role !== null) {
        const result = roles.every(val => user.role.includes(val));
        if (result) {
          next();
        }
        else {
          res.sendStatus(401);
        }
      }
      else {
        res.sendStatus(401);
      }
    }
    else {
      res.sendStatus(401);
    }
  };
};

export {authorizeAccessToken, authorizeRole};