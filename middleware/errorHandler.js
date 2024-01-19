
// const errorHandler = (err, req, res, next) => {
//   // Check if the error is an HttpError
//   if (err instanceof HttpError) {
//     // Send the error status and message as a response
//     return res.status(err.status).json({ message: err.message });
//   }

//   // If it's not an HttpError, continue to the next middleware
//   next(err);
// };

// module.exports = errorHandler;
