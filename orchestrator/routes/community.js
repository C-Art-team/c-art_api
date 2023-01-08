const router = require('express').Router
const communityController = require('../controllers/community')

router.get('/', communityController.getAllCommunities)
router.get('/:id', communityController.getOneCommunity)

module.exports = router
