const { User } = require("../models/");
const {
  comparePassword,
  signToken,
  verifyToken,
  signAuthToken,
} = require("../helpers/");

class Controller {
  static async register(req, res, next) {
    try {
      const { email, password, username, preference, address, phoneNumber } =
        req.body;
      const newUser = await User.create({
        email,
        password,
        username,
        preference,
        address,
        phoneNumber,
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

  static async authenticating(req, res, next) {
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
      const auth_token = signAuthToken({
        id: payload.id,
        email: payload.email,
        username: user.username,
        preference: user.preference,
      });
      res.json({
        auth_token,
      });
    } catch (err) {
      next(err);
    }
  }

  static async editProfile(req, res, next) {
    try {
      const { id } = req.params;
      const { username, preference, address, phoneNumber } = req.body;
      const user = await User.findOne({ where: { id } });
      if (!user) {
        throw { name: "UserNotFound" };
      }
      if (!username) {
        throw { name: "UserEmpty" };
      }
      await User.update(
        { username, preference, address, phoneNumber },
        { where: { id } }
      );
      res.json({ id, username, preference, address, phoneNumber });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
