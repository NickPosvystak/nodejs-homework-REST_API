const User = require("../models/userModel");
const { HttpError } = require("../units");
const ImageService = require("./imageService");
const { signToken } = require("./jwtServices");

exports.updateMe = async (userData, user, file) => {
  if (file) {
    console.log({ file });
    user.avatar = file.path.replace('public', '');
    // user.avatar = await ImageService.saveImage(
    //   file,
    //   { maxFileSize: 1.2, width: 100, height: 100 },
    //   "avatars",
    //   "users",
    //   user.id
    //   );
      console.log('user: ========>❌', user);
  }

  Object.keys(userData).forEach((key) => {
    user[key] = userData[key];
  });

  return user.save();
};
exports.getOneUser = (id) => User.findById(id);

