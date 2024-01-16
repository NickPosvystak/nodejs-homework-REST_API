const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/serverConfig");
const { User } = require("../models/userModel");
const { HttpError } = require("../units");

const authenticateToken = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    return next( new HttpError(401, "Not authorized"));
  }
  try {
    const { id } = jwt.verify(token, jwtSecret);
    const user = await User.findById(id);

    if (!user) {
      return next(new HttpError(401, "Not authorized"));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }
    return next(new HttpError(401, "Not authorized"));
  }
};

module.exports = authenticateToken;
