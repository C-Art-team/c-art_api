const { Community } = require('../models')

class communityController {
    static async findAllCommunities(req, res, next) {
        try {
            const communities = await Community.findAll({
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            })
            res.status(200).json(communities)

        } catch (error) {
            next(error)
        }
    }

    static async findOneCommunity(req, res, next) {
        try {
            const { id } = req.params
            const community = await Community.findOne({
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                where: { id }
            })
            res.status(200).json(community)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = communityController