const axios = require('axios')
const USERS_URL = process.env.USERS_URL

class ControllerUser{
    static async register(req, res, next){
        try {
            const { email, password, username, preference } = req.body
            const {data} = await axios({
                method: 'POST',
                url: `${USERS_URL}register`,
                data: { email, password, username, preference }
            })
            res.status(201).json(data)
        } catch (err) {
            next(err)
        }
    }
    static async login(req, res, next){
        try {
            const { email, password } = req.body;
            const {data} = await axios({
                method: 'POST',
                url: `${USERS_URL}login`,
                data: { email, password }
            })
            res.json(data)
        } catch (err) {
            next(err)
        }
    }
    static test(req, res, next){
        res.json("masuk nih")
    }
}

module.exports = ControllerUser