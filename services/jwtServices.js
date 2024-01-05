const jwt = require("jsonwebtoken");

const { HttpError } = require("../units");
const { serverConfig } = require("../config");


exports.signToken = (id) =>
  jwt.sign({ id }, serverConfig.jwtSecret, {
    expiresIn: serverConfig.jwtExpires,
  });


exports.checkToken = (token) => {
  if (!token) throw new HttpError(401, "Not logged in...");

  try {
    const { id } = jwt.verify(token, serverConfig.jwtSecret);

    return id;
    
  } catch (err) {
    throw new HttpError(401, "Not logged in...");
  }
};

