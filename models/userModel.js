const { genSalt, hash, compare } = require("bcrypt");
const { model, Schema } = require("mongoose");
const Joi = require("joi");
const { regex } = require("../constants");
const handleMongooseError = require("../units/mongooseError");
const crypto = require("crypto");

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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.post("save", handleMongooseError, async function (next) {
  if (this.isNew) {
    const emailHash = crypto.createHash("md5").update(this.email).digest("hex");

    this.avatarURL = `https://www.gravatar.com/avatar/${emailHash}.jpg?d=robohash`;
  }
   next();
});

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
