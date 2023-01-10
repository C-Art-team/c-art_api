function errorHandler(err, req, res, next) {
  const { status, message } = err.response.data;

  
  res.status(status).json({ status, message });
}

module.exports = errorHandler;
