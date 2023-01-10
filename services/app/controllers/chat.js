const { Chat } = require("../models");

class ControllerChat {
  static async getAllForumChat(req, res, next) {
    try {
      const { tag } = req.params;
      const chats = await Chat.findAll({ where: {tag}} );
      res.status(200).json(chats);
    } catch (error) {
      next(error);
    }
  }

  static async newChatForum(req, res, next) {
    try {
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
      const chats = await Chat.findAll({
        where:{tag},
        order : [['createdAt','asc']]
      });
      res.status(201).json(chats)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = ControllerChat;
