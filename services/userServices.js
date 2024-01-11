const User = require("../models/userModel");
const { HttpError } = require("../units");
const ImageService = require("./imageService");
const { signToken } = require("./jwtServices");
const jimp = require("jimp");
const fse = require("fs-extra");
const path = require("path");
const uuid = require("uuid").v4;

const TMP_DIR = path.join(__dirname, "..", "tmp");
const AVATARS_DIR = path.join(__dirname, "..", "public", "avatars");

fse.ensureDirSync(TMP_DIR);
fse.ensureDirSync(AVATARS_DIR);

exports.updateMe = async ( userData, user, file, res) => {
  try {
      // let avatarURL;
    if (file) {
      const { path: tmpPath, filename } = file;

      const fileName = `${user._id}_${filename}`;

      const result = path.join(TMP_DIR, fileName);

      await fse.rename(tmpPath, result);

      //  size to 250x250
      const avatar = await jimp.read(result);
      avatar.resize(250, 250).write(result);

      const avatarPath = path.join(AVATARS_DIR, fileName);
      await fse.move(result, avatarPath);

      // const avatarURL = path.join("avatars", fileName);
      // console.log('avatarURL: ====================>', avatarURL);
      // user.avatarURL = avatarURL;
    }

    Object.keys(userData).forEach((key) => {
      user[key] = userData[key];
    });
return user.save();
    // return res.status(200).json({ avatarURL: avatarURL || null });

  } catch (error) {
    return error.message;
  }
};

exports.getOneUser = (id) => User.findById(id);
