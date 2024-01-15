const bcrypt = require("bcrypt");
const { User } = require("../models/userModel");
const { catchAsync, HttpError } = require("../units");
const { jwtServices, userServices, sendEmail } = require("../services");
const { authenticateToken } = require("../middleware");
const crypto = require("crypto");
const uuid = require("uuid").v4;
const { serverConfig } = require("../config");

const { BASE_URL } = process.env;

const register = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  console.log('user:===========>> ', user);

  if (user) {
    throw HttpError(409, "Email in use");
  }
  
  const hashPassword = await bcrypt.hash(password, 10);

  const verificationToken = uuid();
  console.log("verificationToken: ===========>>>>", verificationToken);

  const newUser = await User.create({
    email,
    password: hashPassword,
    verificationToken,
  });
  console.log('newUser: =====================>>>>>>>', newUser);
  
  // Generate avatarURL
  const emailHash = crypto.createHash("md5").update(email).digest("hex");
  const avatarURL = `https://www.gravatar.com/avatar/${emailHash}.jpg?d=robohash`;

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${serverConfig.BASE_URL}/api/users/verify/${verificationToken} ">Click to verify email</a>`,
  };
  await sendEmail(verifyEmail);

  // Update user with avatarURL
  newUser.avatarURL = avatarURL;
  newUser.verificationToken = verificationToken;
  await newUser.save();

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    },
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const token = jwtServices.signToken(user.id);

  res.status(200).json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
});

const current = catchAsync(async (req, res) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
});

const logout = catchAsync(async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  //  req.user.token = undefined;
  res.status(204).send();
});

const subscription = async (req, res) => {
  try {
    const { subscription } = req.body;
    const allowedSubscriptions = ["starter", "pro", "business"];

    if (!allowedSubscriptions.includes(subscription)) {
      return res.status(400).json({ error: "Invalid subscription value" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { subscription },
      { new: true }
    );

    return res.status(200).json({
      email: updatedUser.email,
      subscription: updatedUser.subscription,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const avatars = catchAsync(async (req, res) => {
  const updatedUser = await userServices.updateMe(
    req.body,
    req.user,
    req.file,
    res
  );
  console.log("updatedUser:  ✅", updatedUser);

  updatedUser.password = undefined;

  res.status(200).json({
    msg: "Success!",
    user: updatedUser,
  });
});

const verifyEmail = catchAsync(async (req, res) => {
  const { verificationToken } = req.params;
  console.log('req.params: ==========>❓', req.params);

  const user = await User.findOne({ verificationToken });
  console.log("user: ==========>>>", user);

  if (!user) {
    throw new HttpError(404, "User not found");
  }
  if (!user.verify) {
    throw new HttpError(403, "Email is not verified");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  console.log('user._id,: =========----------->>>', user._id,);
  
  res.status(200).json({ message: "verification successful" });
});

const resendVerification = catchAsync(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  if (user.verify) {
    throw new HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${serverConfig.BASE_URL}/api/users/verify/${user.verificationToken} ">Click to verify email</a>`,
  };
  await sendEmail(verifyEmail);
 

  res.status(200).json({ message: "Verification email sent" });
});

module.exports = {
  register: register,
  login: login,
  current: current,
  subscription: subscription,
  logout: [authenticateToken, logout],
  avatars: avatars,
  verifyEmail: verifyEmail,
  resendVerification: resendVerification,
};
