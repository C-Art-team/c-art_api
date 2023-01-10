const axios = require('axios')
const USERS_URL = process.env.USERS_URL
const redis = require("../config/ioredis");

class ControllerUser {
    static async register(req, res, next) {
        try {
            const { email, password, username } = req.body
            const { data } = await axios({
                method: 'POST',
                url: `${USERS_URL}register`,
                data: { email, password, username }
            })
            res.json(data)
        } catch (err) {
            next(err)
        }
    }
    static async verify(req, res, next) {
        try {
            const { token } = req.params;
            const { data } = await axios({
                url: `${USERS_URL}register/verify/${token}`,
            })
            res.status(201).json(data)
        } catch (err) {
            next(err)
        }
    }
    static async login(req, res, next) {
        // console.log(req.body)
        try {
            const { email, password } = req.body
            const { data } = await axios({
                method: 'POST',
                url: `${USERS_URL}login`,
                data: { email, password }
            })
            // console.log(data)
            res.json(data)
        } catch (err) {
            // console.log(err)
            next(err)
        }
    }
    static async facebookLogin(req, res, next) {
        try {
            const { email, username } = req.headers
            const { data } = await axios({
                method: 'POST',
                url: `${USERS_URL}facebookLogin`,
                headers: { email, username }
            })
            res.json(data)
        } catch (err) {
            next(err)
        }
    }
    static async googleLogin(req, res, next) {
        try {
            const { google_token } = req.headers
            const { data } = await axios({
                method: 'POST',
                url: `${USERS_URL}googleLogin`,
                headers: { google_token }
            })
            res.json(data)
        } catch (err) {
            next(err)
        }
    }
    static async editProfile(req, res, next) {
        try {
            const { id } = req.params
            const { username, preference, address, phoneNumber } = req.body
            const { data } = await axios({
                method: 'PATCH',
                url: `${USERS_URL}edit/${id}`,
                data: { username, preference, address, phoneNumber }
            })
            await redis.del("user");
            res.json(data)
        } catch (err) {
            next(err)
        }
    }
    static async deleteAccount(req, res, next) {
        try {
            const { id } = req.params
            const { access_token, user } = req.user;
            const { data } = await axios({
                method: 'DELETE',
                url: `${USERS_URL}delete/${id}`,
                headers: { access_token, ...user }
            })
            await redis.del("user")
            res.json(data)
        } catch (err) {
            next(err)
        }
    }
    static async userProfile(req, res, next) {
        try {
            const { access_token, user } = req.user;
            const { data } = await axios({
                url: `${USERS_URL}profile`,
                headers: { access_token, ...user }
            })
            res.json(data)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = ControllerUser