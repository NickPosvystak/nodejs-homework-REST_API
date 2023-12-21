const { catchAsync, httpError } = require("../units");
const { userValidators } = require("../units/validators");
const { userServices } = require("../services");

exports.checkSignupData = catchAsync(async (req, res, next) => {
    const { value, error } = userValidators.signupUserDataValidator(req.body);
    
  console.log("req.body: ", req.body);

  if (error) throw new httpError(400, "Invalid user data..", error);

  await userServices.checkUserExists({ email: value.email });

  req.body = value;

  next();
});
