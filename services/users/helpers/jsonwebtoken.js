const jwt = require("jsonwebtoken");

function signToken(payload) {
  return jwt.sign(payload, process.env.SECRET);
}

function signAuthToken(payload) {
  return jwt.sign(payload, process.env.AUTH_SECRET);
}

function verifyToken(token) {
  return jwt.verify(token, process.env.SECRET);
}

function verifyAuthToken(token) {
  return jwt.verify(token, process.env.AUTH_SECRET);
}

module.exports = { signToken, verifyToken, signAuthToken, verifyAuthToken };
