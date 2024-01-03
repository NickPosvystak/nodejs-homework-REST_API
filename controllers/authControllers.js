const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { registerUser } = require("../services/userServices");
const { catchAsync, httpError } = require("../units");

exports.signup = async (req, res, next) => {
  const { email, password, token } = req.body;
  try {
    // const user = await registerUser({ email, password });
    const user = await User.findOne({ email: email });
    console.log('user: ', user);
    if (user) {
      throw httpError(409, "Email in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ ...req.body, password: hashPassword });

    res.status(201).json({
      msg: "Success",
      user: {
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      throw new httpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ ...req.body, password: hashPassword });

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};
exports.login = catchAsync(async (req, res) => {
  const { user, token } = await userServices.login(req.body);

  res.status(200).json({
    msg: "Success",
    user,
    token,
  });
});
