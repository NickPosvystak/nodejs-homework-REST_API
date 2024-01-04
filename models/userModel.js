const { genSalt, hash, compare } = require("bcrypt");
const { model, Schema } = require("mongoose");
const Joi = require("joi");
const { regex } = require("../constants");
const handleMongooseError = require("../units/mongooseError");



const userSchema = new Schema({
 
  password: {
    type: String,
    required: [true, "Set password for user"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: String,
});

userSchema.post("save", handleMongooseError);


const registerSchema = Joi.object({
  email: Joi.string().pattern(regex.emailRegexp).required(),
  password: Joi.string().pattern(regex.PASSWD_REGEX).min(6).required(),
  subscription: Joi.string(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(regex.emailRegexp).required(),
  password: Joi.string().pattern(regex.PASSWD_REGEX).min(6).required(),
  subscription: Joi.string(),
});

const schemas = {
  registerSchema,
  loginSchema,
};

const User = model("User", userSchema);

module.exports = { User, schemas };
