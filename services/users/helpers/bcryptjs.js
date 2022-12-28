const bcrypt = require("bcryptjs");

function hashPassword(password) {
  return bcrypt.hashSync(password, 8);
}

function comparePassword(rawPassword, hashPassword) {
  return bcrypt.compareSync(rawPassword, hashPassword);
}

module.exports = { hashPassword, comparePassword };
