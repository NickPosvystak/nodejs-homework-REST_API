const { catchAsync, HttpError } = require("../units");
const { userValidators } = require("../units/validators");
const { checkUserExists } = require("../services/userServices");

exports.checkSignupData = catchAsync(async (req, res, next) => {
  const { value, error } = userValidators.signupUserDataValidator(req.body);

  console.log("req.body:===========>>>>>>> ", req.body);

  if (error) throw new HttpError(400, "Invalid user data..", error);

  await checkUserExists({ email: value.email });

  req.body = value;

  next();
});
