function errorHandler(err, req, res, next) {
  let status = 500;
  let message = "Internal Server Error";

  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    status = 400;
    message = `${err.errors.map((el) => el.message).join(", ")}`;
  }

  res.status(status).json({ status, message });
}

module.exports = errorHandler;
