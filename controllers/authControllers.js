const { registerUser } = require("../services/userServices");
const { catchAsync } = require("../units");

exports.signup = async (req, res, next) => {

  const { email, password, token } = req.body;
  try {
    const user = await registerUser({ email, password });
    
      res.status(201).json({
        msg: "Success",
        user,
        token,
      });
    
  } catch (error) {
    next(error);
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
