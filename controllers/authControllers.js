const bcrypt = require("bcrypt");
const { User } = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { registerUser } = require("../services/userServices");
const { catchAsync, httpError } = require("../units");

const { JWT_SECRET } = require("../envs/development.env");
const { jwtExpires } = require("../envs/development.env");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw httpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw httpError(401, "Email is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    console.log("Provided password:", password);
    console.log("Stored hashed password:", user.password);
    throw httpError(401, "Password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: jwtExpires });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

// exports.signup = async (req, res, next) => {
//   const { email, password, token } = req.body;
//   try {
//     // const user = await registerUser({ email, password });
//     const user = await User.findOne({ email: email });
//     console.log('user: ', user);
//     if (user) {
//       throw httpError(409, "Email in use");
//     }
//     const hashPassword = await bcrypt.hash(password, 10);

//     const newUser = await User.create({ ...req.body, password: hashPassword });
//     console.log('newUser: ', newUser);

//     res.status(201).json({
//       msg: "Success",
//       user: {
//         name: newUser.name,
//         email: newUser.email,
//       },
//       token,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.register = async (req, res, next) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (user) {
//       throw new httpError(409, "Email in use");
//     }

//     const hashPassword = await bcrypt.hash(password, 10);

//     const newUser = await User.create({ ...req.body, password: hashPassword });

//     res.status(201).json({
//       user: {
//         email: newUser.email,
//         subscription: newUser.subscription,
//       },
//     });
//   } catch (error) {
//     next(error); // Pass the error to the error-handling middleware
//   }
// };
// exports.login = catchAsync(async (req, res) => {
//   const { user, token } = await userServices.login(req.body);

//   res.status(200).json({
//     msg: "Success",
//     user,
//     token,
//   });
// });
module.exports = {
  register: register,
  login: login,
  // getCurrent: ctrlWrapper(getCurrent),
  // logout: ctrlWrapper(logout),
};