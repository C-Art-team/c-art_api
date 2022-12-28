const { Op } = require("sequelize");
const { Chat, sequelize } = require("../models");

class ControllerChat {
  static async getAll(req, res, next) {
    try {
      const { senderId } = req.user.id;
      const chats = await Chat.findAll({ where: { senderId } });
      res.status(200).json(chats);
    } catch (error) {
      next(error);
    }
  }

  static async newChat(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { text ,category} = req.body.data;
      const senderId = 1
      const newChat = await Chat.create(
        {
          senderId,
          text,
          tag : category
        },
        { transaction: t }
      );
      console.log(newChat)

      await t.commit()
      const chats = await Chat.findAll({
        where: {
          [Op.or]: [{ senderId }, { tag : category }],
        },
        order : [['createdAt','asc']]
      },{transaction : t});
      console.log(chats,'daro services')

      res.status(201).json(chats)
    } catch (error) {
      await t.rollback()
      next(error)
    }
  }
}

module.exports = ControllerChat;