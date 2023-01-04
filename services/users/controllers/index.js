const { User } = require("../models/");
const { comparePassword, signToken, verifyToken } = require("../helpers/");

class Controller {
  static async register(req, res, next) {
    try {
      const { email, password, username, preference } = req.body;
      const newUser = await User.create({
        email,
        password,
        username,
        preference,
      });
      res.status(201).json({ id: newUser.id, email, username, preference });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw { name: "EmailPasswordRequired" };
      }
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw { name: "InvalidCredentials" };
      }
      const isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) {
        throw { name: "InvalidCredentials" };
      }
      const access_token = signToken({
        id: user.id,
        email,
      });
      res.json({
        access_token,
        email,
        username: user.username,
        preference: user.preference,
      });
    } catch (err) {
      next(err);
    }
  }

  static async authentication(req, res, next) {
    try {
      const { access_token } = req.headers;
      if (!access_token) {
        throw { name: "Unauthorized" };
      }
      const payload = verifyToken(access_token);
      const user = await User.findOne({
        where: {
          id: payload.id,
          email: payload.email,
        },
      });
      if (!user) {
        throw { name: "Unauthorized" };
      }
      res.json({
        access_token,
        id: payload.id,
        email: payload.email,
        username: user.username,
        preference: user.preference,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
