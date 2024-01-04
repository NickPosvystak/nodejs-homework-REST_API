// const { Types } = require("mongoose");

const User = require("../models/userModel");
const { httpError } = require("../units");
const { signToken } = require("./jwtServices");

// exports.registerUser = async (userData) => {

//   const newUserData = {
// ...userData,
//   }
//   const newUser = await User.create(newUserData);

//   newUser.password = undefined;

//    const token = signToken(newUser.id);

//    return { user: newUser, token };
// };

exports.checkUserExists = async (filter) => {
  const userExists = await User.exists(filter);

  if (userExists) throw new httpError(409, "User exists");
};

exports.register = async (data) => {
  const newUserData = {
    ...data,
  };

  const newUser = await User.create(newUserData);

  newUser.password = undefined;

  

  return { user: newUser};
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  console.log("user LOGIN---------------->>: ", user);

  if (!user) throw new httpError(401, "Not authorized..");

  const passwdIsValid = await user.checkPassword(password, user.password);

  if (!passwdIsValid) throw new httpError(401, "Not authorized..");

  // user.password = undefined;

  const token = signToken(newUser.id);

  return { user: newUser, token };
};
