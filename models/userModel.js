const { genSalt, hash, compare } = require("bcrypt");
const { model, Schema } = require("mongoose");
const Joi = require("joi");
const { regex } = require("../constants");
const handleMongooseError = require("../units/mongooseError");


const userSchema = new Schema(
  {
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
    avatarURL: String,
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
      
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

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

const emailSchema = Joi.object({
  email: Joi.string().email().required(),
});

const schemas = {
  registerSchema,
  loginSchema,
  emailSchema,
};

const User = model("User", userSchema);

module.exports = { User, schemas };
