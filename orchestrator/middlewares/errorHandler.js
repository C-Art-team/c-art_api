function errorHandler(err, req, res, next) {
  console.log(err)
  const { status, message } = err.response.data;

  
  res.status(status).json({ status, message });
}

module.exports = errorHandler;
