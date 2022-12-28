const { User } = require("../models/");

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
      res.status(201).json({ id: newUser.id, email, username });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
