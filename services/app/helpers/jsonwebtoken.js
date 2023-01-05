const jwt = require("jsonwebtoken");

function verifyAuthToken(token) {
  return jwt.verify(token, process.env.AUTH_SECRET);
}

module.exports = { verifyAuthToken };
