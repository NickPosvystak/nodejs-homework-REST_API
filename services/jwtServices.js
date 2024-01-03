const jwt = require("jsonwebtoken");

const { serverConfig } = require("../config");
const { httpError } = require("../units");


exports.signToken = (id) =>
  jwt.sign({ id }, serverConfig.jwtSecret, {
    expiresIn: serverConfig.jwtExpires,
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

