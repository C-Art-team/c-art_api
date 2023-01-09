function errorHandler(err, req, res, next) {
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
  } else if (err.name === "Forbidden") {
    status = 403;
    message = "You don't have access";
  } else if (err.name === "UserNotFound") {
    status = 404;
    message = "User not found";
  } else if (err.name === "UserEmpty") {
    status = 400;
    message = "Username cannot be empty";
  }

  res.status(status).json({ status, message });
}

module.exports = errorHandler;
