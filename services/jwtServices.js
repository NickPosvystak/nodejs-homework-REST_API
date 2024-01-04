const jwt = require("jsonwebtoken");

const { httpError } = require("../units");
const serverConfig = require("../config/serverConfig");
const { JWT_SECRET, jwtExpires } = require("../envs/development.env");


exports.signToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, {
    expiresIn: jwtExpires,
  });


exports.checkToken = (token) => {
  if (!token) throw new httpError(401, "Not logged in...");

  try {
    const { id } = jwt.verify(token, serverConfig.jwtSecret);

    return id;
    
  } catch (err) {
    throw new httpError(401, "Not logged in...");
  }
};

