const jwt = require("jsonwebtoken");

function signToken(payload) {
  return jwt.sign(payload, process.env.SECRET);
}

function signRegisterToken(payload) {
  return jwt.sign(payload, process.env.REGISTER_SECRET);
}

function verifyToken(token) {
  return jwt.verify(token, process.env.SECRET);
}

function verifyRegisterToken(token) {
  return jwt.verify(token, process.env.REGISTER_SECRET);
}

module.exports = {
  signToken,
  verifyToken,
  signRegisterToken,
  verifyRegisterToken,
};
