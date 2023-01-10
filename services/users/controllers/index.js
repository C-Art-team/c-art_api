const { User, sequelize } = require("../models/");
const {
  comparePassword,
  signToken,
  verifyToken,
  verify,
  registerVerify,
  signRegisterToken,
  verifyRegisterToken,
} = require("../helpers/");
const { Op } = require("sequelize");

class Controller {
  static async register(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { email, password, username } = req.body;
      await User.create(
        {
          email,
          password,
          username,
        },
        { transaction: t }
      );
      await t.rollback();
      const token = signRegisterToken({
        email,
        password,
        username,
      });
      registerVerify(email, username, token);
      res.json({ message: `Please check your email to verify ${email}` });
    } catch (err) {
      await t.rollback();
      next(err);
    }
  }

  static async verify(req, res, next) {
    try {
      const { token } = req.params;
      const { email, password, username } = verifyRegisterToken(token);
      const user = await User.findOne({
        where: {
          [Op.or]: [
            {
              email,
            },
            {
              username,
            },
          ],
        },
      });
      if (user) {
        throw { name: "AlreadyVerified" };
      }
      const newUser = await User.create({
        email,
        password,
        username,
      });
      res.status(201).json({ id: newUser.id, email, username });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    // console.log('login')
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

  static async facebookLogin(req, res, next) {
    try {
      const { email, username } = req.headers;
      const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: {
          email,
          username,
          password: "dariMarkZuckerberg",
        },
        hooks: false,
      });
      const access_token = signToken({
        id: user.id,
        email,
      });
      res.json({
        access_token,
        id: user.id,
        email,
        username: user.username,
        preference: user.preference,
      });
    } catch (err) {
      next(err);
    }
  }

  static async googleLogin(req, res, next) {
    try {
      const { google_token } = req.headers;
      const { email, name } = await verify(google_token);
      const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: {
          email,
          username: name,
          password: "dariMbahGugel",
        },
        hooks: false,
      });
      const access_token = signToken({
        id: user.id,
        email,
      });
      res.json({
        access_token,
        id: user.id,
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
      res.json({
        id: payload.id,
        email: payload.email,
        username: user.username,
        preference: user.preference,
      });
    } catch (err) {
      next(err);
    }
  }

  static async editProfile(req, res, next) {
    try {
      const { id } = req.params;
      const { username, preference, address, phoneNumber } = req.body;
      const uniqPreference = [...new Set(preference)];
      const user = await User.findOne({ where: { id } });
      if (!user) {
        throw { name: "UserNotFound" };
      }
      if (!username) {
        throw { name: "UserEmpty" };
      }
      await User.update(
        {
          username,
          preference: uniqPreference.join(", "),
          address,
          phoneNumber,
        },
        { where: { id } }
      );
      res.json({
        id,
        username,
        preference: uniqPreference,
        address,
        phoneNumber,
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteAccount(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findOne({ where: { id } });
      if (!user) {
        throw { name: "UserNotFound" };
      }
      await User.destroy({ where: { id } });
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  static async userProfile(req, res, next) {
    try {
      const { id } = req.user;
      const user = await User.findOne({
        where: { id },
        attributes: { exclude: ["password"] },
      });
      if (!user) {
        throw { name: "UserNotFound" };
      }
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  static async userDetail(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findOne({ where: { id } });
      if (!user) {
        throw { name: "UserNotFound" };
      }
      res.json(user);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
