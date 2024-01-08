
const User = require("../models/userModel");
const { HttpError } = require("../units");
const { signToken } = require("./jwtServices");



// exports.checkUserExists = async (filter) => {
//   const userExists = await User.exists(filter);

//   if (userExists) throw new HttpError(409, "User exists");
// };

// exports.register = async (data) => {
//   const newUserData = {
//     ...data,
//   };

//   const newUser = await User.create(newUserData);

//   newUser.password = undefined;

  

//   return { user: newUser};
// };

// exports.login = async ({ email, password }) => {
//   const user = await User.findOne({ email }).select("+password");
//   console.log("user LOGIN---------------->>: ", user);

//   if (!user) throw new HttpError(401, "Not authorized..");

//   const passwdIsValid = await user.checkPassword(password, user.password);

//   if (!passwdIsValid) throw new HttpError(401, "Not authorized..");

//   // user.password = undefined;

//   const token = signToken(newUser.id);

//   return { user: newUser, token };
// };
