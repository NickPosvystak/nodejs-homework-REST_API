const bcrypt = require("bcrypt");
const { User } = require("../models/userModel");
const { catchAsync, HttpError } = require("../units");
const { jwtServices } = require("../services");
const { authenticateToken } = require("../middleware");


const register = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    throw new HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ email, password: hashPassword });

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

module.exports = {
  register: register,
  login: login,
  current: current,
  logout: [authenticateToken, logout],
};
