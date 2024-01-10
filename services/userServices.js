const User = require("../models/userModel");
const { HttpError } = require("../units");
const ImageService = require("./imageService");
const { signToken } = require("./jwtServices");

exports.updateMe = async (userData, user, file) => {
  if (file) {
    console.log({ file });
    // user.avatar = file.path.replace('public', '');
    user.avatar = await ImageService.saveImage(
      file,
      { maxFileSize: 1.2, width: 100, height: 100 },
      "avatars",
      "users",
      user.id
      );
      console.log('user: ========>❌', user);
  }

  Object.keys(userData).forEach((key) => {
    user[key] = userData[key];
  });

  return user.save();
};
exports.getOneUser = (id) => User.findById(id);

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
