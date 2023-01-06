const { hashPassword, comparePassword } = require("./bcryptjs");
const {
  signToken,
  verifyToken,
  signAuthToken,
  verifyAuthToken,
} = require("./jsonwebtoken");

module.exports = {
  hashPassword,
  comparePassword,
  signToken,
  verifyToken,
  signAuthToken,
  verifyAuthToken,
};
