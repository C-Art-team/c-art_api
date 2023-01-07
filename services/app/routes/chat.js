const router = require('express').Router()

const ControllerChat = require('../controllers/chat')

router.get('/:tag',ControllerChat.getAllForumChat)
router.post('/',ControllerChat.newChatForum)

module.exports = router