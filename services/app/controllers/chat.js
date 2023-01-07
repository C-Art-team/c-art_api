const { Op } = require("sequelize");
const { Chat, sequelize } = require("../models");

class ControllerChat {
  static async getAllForumChat(req, res, next) {
    try {
      const { tag } = req.params;
      const chats = await Chat.findAll({ where: {tag}} );
      res.status(200).json(chats);
    } catch (error) {
      console.log(error)
      next(error);
    }
  }

  static async newChatForum(req, res, next) {
    try {
      console.log(req.body)
      const { text ,tag } = req.body.payload;
      const { username} = req.body.userData.user;
      const sender = username
      const newChat = await Chat.create(
        {
          sender,
          text,
          tag
        }
      );
      console.log(newChat)
      const chats = await Chat.findAll({
        where:{tag},
        order : [['createdAt','asc']]
      });
      console.log(chats,'daro services')
      res.status(201).json(chats)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

module.exports = ControllerChat;
