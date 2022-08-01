import {expressjwt} from "express-jwt";
import jwksRsa from "jwks-rsa";
import config from "../../config/index.js";
import User from "../../models/user.js";
import createError from "http-errors";
import {logger} from "../../utils/index.js";

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
      const user = await User.findUser(req.auth.email);
      logger.info(`Query user: ${req.auth.email}, Role Required: ${roles}, User: ${JSON.stringify(user)}`);
      if (user?.role !== null) {
        const result = roles.every(val => user.role.includes(val));
        if (result) {
          next();
        }
        else {
          return next(createError(401, "You do not have permission"));
        }
      }
      else {
        return next(createError(400, "User does not exist"));
      }
    }
    else {
      return next(createError(400, "No email in token"));
    }
  };
};

export {authorizeAccessToken, authorizeRole};