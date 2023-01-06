const axios = require('axios')
const USERS_URL = process.env.USERS_URL
const redis = require("../config/ioredis");

class ControllerUser{
    static async register(req, res, next){
        try {
            const { email, password, username, preference, address, phoneNumber } = req.body
            const {data} = await axios({
                method: 'POST',
                url: `${USERS_URL}register`,
                data: { email, password, username, preference, address, phoneNumber }
            })
            res.status(201).json(data)
        } catch (err) {
            next(err)
        }
    }
    static async login(req, res, next){
        try {
            console.log(req.body)
            const { email, password } = req.body
            const {data} = await axios({
                method: 'POST',
                url: `${USERS_URL}login`,
                data: { email, password }
            })
            res.status(200).json(data)
        } catch (err) {
            next(err)
        }
    }
    static async editProfile(req, res, next){
        try {
            const { id } = req.params
            const { username, preference, address, phoneNumber } = req.body
            const { auth_token } = req.user
            const {data} = await axios({
                method: 'PATCH',
                url: `${USERS_URL}edit/${id}`,
                headers: { auth_token },
                data: { username, preference, address, phoneNumber }
            })
            await redis.del("user");
            res.json(data)
        } catch (err) {
            next(err)
        }
    }
    static async deleteAccount(req, res, next){
        try {
            const { id } = req.params
            const { auth_token } = req.user
            const {data} = await axios({
                method: 'DELETE',
                url: `${USERS_URL}delete/${id}`,
                headers: { auth_token }
            })
            await redis.del("user")
            res.json(data)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = ControllerUser