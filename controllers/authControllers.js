const bcrypt = require("bcrypt");
const { User } = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { catchAsync, httpError } = require("../units");
const { signToken } = require("../services/jwtServices");
const { JWT_SECRET } = process.env;
const { jwtExpires} = process.env;


const register = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  console.log("Found User register:========================>>>>", user);
  if (user) {
    throw httpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  console.log("hashPassword: ", hashPassword);

  const newUser = await User.create({ email, password: hashPassword });
  console.log("newUser:-------------------->>> ", newUser);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
   
  if (!user) {
    throw httpError(401, "Email is wrong");
  }

  const passwordCompare = await bcrypt.compare(
    password,
    user.password
  );

  console.log("passwordCompare----------->:", passwordCompare);

if (!passwordCompare) {
    throw httpError(401, "Password is wrong");
  }


const token = signToken(user.id);

   res.status(200).json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
});

module.exports = {
  register: register,
  login: login,
  // getCurrent: getCurrent,
  // logout: logout,
};
