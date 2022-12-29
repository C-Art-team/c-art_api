const axios = require('axios')

class ControllerCategory {
  static async getAll(req,res,next) {
    try {
      const {data} = await axios.get(`${process.env.APP_URL}categories`)
      console.log(data)
      res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = ControllerCategory