const multer = require("multer");

const jimp = require("jimp");
const path = require("path");
const uuid = require("uuid").v4;
const fse = require("fs-extra");
const { HttpError } = require("../units");

class ImageService {
  static uploadImage(name) {
    const multerStorage = multer.memoryStorage();

    const multerFilter = (req, file, cb) => {
      if (file.mimetype.startWith("image/")) {
        cb(null, true);
      } else {
        cb(new HttpError(400, "Please, upload images only!"), false);
      }
    };
    return multer({
      storage: multerStorage,
      fileFilter: multerFilter,
    }).single("avatarURL");
  }

  static async saveImage(file, options, ...pathSegments) {
    if (
      file.size >
      (options.maxFileSize
        ? options.maxFileSize * 1024 * 1024
        : 1 * 1024 * 1024)
    ) {
      throw new HttpError(400, " File is too large!");
    }
    const fileName = `${uuid()}.jpeg`;
    const fullFilePath = path.join(process.cwd(), "public", ...pathSegments);

    await fse.ensureDir(fullFilePath);
    const avatar = await jimp.read(file.buffer);
    await avatar
      .cover(options.width || 250, options.height || 250)
      .quality(90)
      .writeAsync(path.join(fullFilePath, fileName));
  }
}


// SIMPLE MULTER EXAMPLE
// config storage
const multerStorage = multer.diskStorage({
  destination: (req, file, cbk) => {
    cbk(null, 'public/images');
  },
  filename: (req, file, cbk) => {
    const extension = file.mimetype.split('/')[1]; // 'image/png'

    // <userID>-<random uuid>.<extension>
    cbk(null, `${req.user.id}-${uuid()}.${extension}`);
  },
});

// config filter
const multerFilter = (req, file, cbk) => {
  if (file.mimetype.startsWith('image/')) {
    cbk(null, true);
  } else {
    cbk(new HttpError(400, 'Please, upload images only!!'), false);
  }
};

exports.uploadUserPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
}).single('avatar');

module.exports = ImageService;
