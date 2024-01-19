const bcrypt = require("bcrypt");
const { User } = require("../models/userModel");
const { catchAsync} = require("../units");
const { jwtServices, userServices, sendEmail } = require("../services");
const { authenticateToken } = require("../middleware");
const crypto = require("crypto");
const uuid = require("uuid").v4;
const { serverConfig } = require("../config");
const Email = require("../services/emailService");

require("dotenv").config();

const { BASE_URL } = process.env;

const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
      return res.status(409).json({ error: "Email in use" });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const verificationToken = uuid();

  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
    verificationToken,
    verify: false,
  });
  
  // Generate avatarURL
  const emailHash = crypto.createHash("md5").update(email).digest("hex");
  const avatarURL = `https://www.gravatar.com/avatar/${emailHash}.jpg?d=robohash`;
  
  // Update user with avatarURL
  newUser.avatarURL = avatarURL;
  await newUser.save();


  // Send email notification
  const verifyLink = `${BASE_URL}/api/users/verify/${verificationToken}`;
  await new Email(newUser, verifyLink).sendVerification();
  
   res.status(201).json({
     user: {
      name: newUser.name,
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    },
  });
});

const verifyEmail = catchAsync(async (req, res) => {
  const { verificationToken } = req.params;

    const user = await User.findOneAndUpdate(
      { verificationToken, verify: false },
      { verify: true, verificationToken: null },
      { new: true }
    );
  
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  if (!user.verify) {
    return res.status(403).json({ error: "Email is not verified" });
  }
 
  res.status(200).json({ message: "verification successful" });

});

const resendVerification = catchAsync(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.verify) {
    return res
      .status(400)
      .json({ error: "Verification has already been passed" });
  }

  // Resend email verification link
  const resendLink = `${BASE_URL}/api/users/verify/${user.verificationToken}`;
  await new Email(user, resendLink).sendVerification();

  res.status(200).json({ message: "Verification email sent one more time" });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ error: "Email or password is wrong" });
  }
  if (!user.verify) {
    return res.status(403).json({ error: "Email is not verified" });
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    return res.status(401).json({ error: "Email or password is wrong" });
  }

  const token = jwtServices.signToken(user.id);

  res.status(200).json({
    token: token,
    user: {
      name: user.name,
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

  updatedUser.password = undefined;

  res.status(200).json({
    msg: "Success!",
    user: updatedUser,
  });
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
