const { catchAsync, HttpError } = require("../units");
const { userValidators } = require("../units/validators");
const { checkUserExists } = require("../services/userServices");
const ImageService = require("../services/imageService");


const multer = require("multer");

const jimp = require("jimp");
const path = require("path");
const uuid = require("uuid").v4;
const fse = require("fs-extra");
const { jwtServices, userServices } = require("../services");


exports.checkSignupData = catchAsync(async (req, res, next) => {
  const { value, error } = userValidators.signupUserDataValidator(req.body);

  if (error) throw new HttpError(400, "Invalid user data..", error);

  await checkUserExists({ email: value.email });

  req.body = value;

  next();
});

exports.protect = catchAsync(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer ") &&
    req.headers.authorization.split(" ")[1];
  const userId = jwtServices.checkToken(token);
  console.log('userId: ======>', userId);

  if (!userId) throw new HttpError(401, "Not logged in..");

  const currentUser = await userServices.getOneUser(userId);

  if (!currentUser) throw new HttpError(401, "Not logged in..");

  req.user = currentUser;

  next();
});


// SIMPLE MULTER EXAMPLE
// config storage
const multerStorage = multer.diskStorage({
  destination: (req, file, cbk) => {
    cbk(null, 'public/avatars');
  },
  filename: (req, file, cbk) => {
    const extension = file.mimetype.split('/')[1]; 

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

// exports.uploadUserPhoto = ImageService.uploadImage("avatar");
