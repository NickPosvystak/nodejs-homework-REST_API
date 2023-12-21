const jwt = require("jsonwebtoken");

const { serverConfig } = require("../configs");
const { httpError } = require("../utils");
const { serviceContacts } = require("../models");

exports.signToken = (id) => 
  jwt.sign({ id }, serverConfig.jwtSecret,{ 
    expiresIn: serviceContacts.jwtExpires,
  });
exports.checkToken = (token) => {
  if (!token) throw new httpError(401, "Not logged in..");

  try {
    const { id } = jwt.verify(token, serverConfig.jwtSecret);

    return id;
  } catch (err) {
    throw new httpError(401, "Not logged in..");
  }
};


