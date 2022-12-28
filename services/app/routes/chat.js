const router = require('express').Router()

const ControllerChat = require('../controllers/chat')

router.get('/',ControllerChat.getAll)
router.post('/',ControllerChat.newChat)

module.exports = router