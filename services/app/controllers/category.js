const { Category } = require("../models");

class ControllerCategory {
  static async getAll(req, res, next) {
    try {
      const categories = await Category.findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
          order: [['name', 'ASC']]
        }
      });
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ControllerCategory;
