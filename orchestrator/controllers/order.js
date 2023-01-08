const axios = require('axios')
const APP_URL = process.env.APP_URL
const redis = require('../config/ioredis')
const { access_token, user } = req.user;

class orderController {
    static async getAllOrders(req, res, next) {
        try {
            const ordersCache = await redis.get("orders")
            if (ordersCache) res.json(JSON.parse(ordersCache))
            else {
                const { data } = await axios({
                    url: `${APP_URL}orders`,
                    headers: { access_token, ...user }
                })
                await redis.set("orders", JSON.stringify(data))
                res.json(data)
            }

        } catch (error) {
            next(error)
        }
    }

    static async getOneOrder(req, res, next) {
        try {
            const { id } = req.params
            const orderCache = await redis.get(`orders:${id}`)

            if (orderCache) res.json(JSON.parse(orderCache))
            else {
                const { data } = await axios({
                    url: `${APP_URL}orders/${id}`,
                    headers: { access_token, ...user }
                })
                await redis.set(`orders:${id}`, JSON.stringify(data))
                res.json(data)
            }

        } catch (error) {
            next(error)
        }
    }

    static async generateMidtransToken(req, res, next) {
        try {
            const { id } = req.params
            const { data } = await axios({
                method: "get",
                url: `${APP_URL}orders/pay/${id}`,
                headers: { access_token, ...user }
            })
            res.json(data)
        } catch (error) {
            next(error)
        }
    }

    static async createOrder(req, res, next) {
        try {
            const { artId, amount } = req.body
            const { data } = await axios({
                method: "post",
                url: `${APP_URL}orders`,
                data: { artId, amount },
                headers: { access_token, ...user }
            })
            res.json(data)

        } catch (error) {
            next(error)
        }
    }

    static async patchOrderStatus(req, res, next) {
        try {
            const { id } = req.params
            const { data } = await axios({
                method: 'patch',
                urL: `${APP_URL}orders/${id}`,
                data: {},
                headers: { access_token, ...user }
            })
            res.json(data)
        } catch (error) {
            next(error)
        }
    }

    static async deleteOrder(req, res, next) {
        try {
            const { id } = req.params
            const { data } = await axios({
                method: 'delete',
                url: `${APP_URL}orders/${id}`,
                headers: { access_token, ...user }
            })
            res.json(data)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = orderController