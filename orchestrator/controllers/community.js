const axios = require('axios')
const redis = require('../config/ioredis')
const APP_URL = process.env.APP_URL

class communityController {
    static async getAllCommunities(req, res, next) {
        try {
            const communitiesCache = await redis.get('communities')

            if (communitiesCache) res.json(JSON.parse(communitiesCache))
            else {
                const { data } = await axios.get(`${APP_URL}communities`)
                await redis.set('communities', JSON.stringify(data))
                res.json(data)
            }
        } catch (error) {
            next(error)
        }
    }

    static async getOneCommunity(req, res, next) {
        try {
            const { id } = req.params
            const communityCache = await redis.get(`communities:${id}`)

            if (communityCache) res.json(JSON.parse(communityCache))
            else {
                const { data } = await axios.get(`${APP_URL}communities/${id}`)
                await redis.set(`communities:${id}`, JSON.stringify(data))
                res.json(data)
            }
        } catch (error) {
            // console.log(error);
            next(error)
        }
    }
}

module.exports = communityController