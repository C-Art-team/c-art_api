const { hashPassword, comparePassword } = require("./bcryptjs");
const {
  signToken,
  verifyToken,
  signRegisterToken,
  verifyRegisterToken,
} = require("./jsonwebtoken");
const verify = require("./google-auth-library");
const { registerVerify } = require("./nodemailer");

module.exports = {
  hashPassword,
  comparePassword,
  signToken,
  verifyToken,
  verify,
  registerVerify,
  signRegisterToken,
  verifyRegisterToken,
};
