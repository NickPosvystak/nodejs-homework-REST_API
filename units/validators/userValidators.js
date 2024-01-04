const Joi = require("joi");
const { regex } = require("../../constants/");

const joiValidator = require("./joiValidator");

exports.signupUserDataValidator = joiValidator((data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().pattern(regex.emailRegexp).required(),
      password: Joi.string().regex(regex.PASSWD_REGEX).required(),
    })
    .validate(data)
);
exports.registerSchema = joiValidator((data) =>
  Joi.object({
    email: Joi.string().pattern(regex.emailRegexp).required(),
    password: Joi.string().min(6).required(),
  }).validate(data)
);
