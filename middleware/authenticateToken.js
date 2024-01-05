// const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");
const { jwtServices } = require("../services");
const { HttpError, catchAsync } = require("../units");

const authenticateToken = catchAsync(async (req, res, next) => {
  //  const { authorization = "" } = req.headers;
  //  const [bearer, token] = authorization.split(" ");

  // if (bearer !== "Bearer") {
  //     return next(new HttpError(401, "Not authorized"));
  // }

  // try {
  //   const userId = jwtServices.checkToken(token);
  //   const user = await User.findById(userId);

  //   if (!user || user._id.toString() !== userId) {
  // return next(new HttpError(401, "Not authorized"));
  //   }

  //   res.user = user;

  //   next();

  // } catch {
  //  return next(new HttpError(401, "Not authorized"));

  // }

  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  console.log('bearer:==========> ', bearer);
  console.log('token: ===========>', token);
  if (bearer !== "Bearer") {

    console.log("❌Not authorized - Bearer token missing");
    
    return next(HttpError(401, "Not authorized"));
  }
  try {
    const userId = jwtServices.checkToken(token);
    const user = await User.findById(userId);

    console.log('user: ============>', user);
    if (!user || !user.token || user.token !== token) {

       console.log("❓Not authorized - User not found or token mismatch");
     return next(new HttpError(401, "Not authorized"));
    }

    req.user = user;
    console.log("User authorized:=========>", user);
    next();
  } catch (error) {
    console.error("Error during token verification:", error);
    return next(new HttpError(401, "Not authorized"));
  }
});

module.exports = authenticateToken;
