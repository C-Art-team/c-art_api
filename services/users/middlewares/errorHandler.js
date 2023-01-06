function errorHandler(err, req, res, next) {
  console.log(err)
  let status = 500;
  let message = "Internal Server Error";

  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    status = 400;
    message = `${err.errors.map((el) => el.message).join(", ")}`;
  } else if (err.name === "EmailPasswordRequired") {
    status = 400;
    message = "Both Email and Password is required";
  } else if (err.name === "InvalidCredentials") {
    status = 401;
    message = "Invalid Email or Password";
  } else if (err.name === "Unauthorized") {
    status = 401;
    message = "Please login first";
  } else if (err.name === "JsonWebTokenError") {
    status = 401;
    message = "Invalid token";
  }

  res.status(status).json({ status, message });
}

module.exports = errorHandler;
