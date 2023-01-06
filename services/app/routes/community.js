const router = require('express').Router()
const communityController = require('../controllers/community')

router.get('/', communityController.findAllCommunities)
router.get('/:id', communityController.findOneCommunity)

module.exports = router