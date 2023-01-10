const axios = require("axios");
const appServer = process.env.APP_URL;
const serviceUser = process.env.USERS_URL
const FormData = require("form-data");

class ControllerArt {
  static async getArts(req, res, next) {
    try {
      const { filter, search } = req.query
      const { data } = await axios({
        url: appServer + "arts",
        method: "get",
        params: { filter, search }
      });

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async getArtDetail(req, res, next) {
    try {
      let { id } = req.params;

      const { data } = await axios({
        url: appServer + "arts/" + id,
        method: "get",
      });

      const {data : user} = await axios.get(serviceUser + `${data.AuthorId}`)

      const detailArt = {
        ...data,
        authorName : user.username
      }

      res.status(200).json(detailArt);
    } catch (error) {
      next(error);
    }
  }

  static async getMyArt (req,res,next){
    try {
      let {access_token, user} = req.user

      let {data} = await axios({
        url:appServer + "arts" + "/myarts",
        method:"get",
        headers:{
          access_token, ...user
        }
      })
      
      res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  }

  static async addItem(req, res, next) {
    try {
      const { access_token, user } = req.user;
      let itemData = new FormData();
      req.files.forEach((el) => {
        itemData.append("uploadedFile", el.buffer, el.originalname);
      });

      itemData.append("name", req.body.name);
      itemData.append("price", req.body.price);
      itemData.append("description", req.body.description);
      itemData.append("CategoryId", req.body.CategoryId);

      const { data } = await axios({
        url: appServer + "arts",
        method: "post",
        data: itemData.getBuffer(),
        headers: {
          ...itemData.getHeaders(),
          access_token,
          ...user
        },
      });

      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).end();
    }
  }

  static async patchArtPrice(req, res, next) {
    try {
      const { access_token, user } = req.user;
      const { price } = req.body
      const { id } = req.params
      const { data } = await axios({
        method: 'patch',
        url: `${appServer}arts/${id}`,
        headers: { access_token, ...user },
        data: { price }
      })
      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  static async deleteArt(req, res, next) {
    try {
      const { access_token, user } = req.user;

      const { id } = req.params
      const { data } = await axios({
        method: 'delete',
        url: `${appServer}arts/${id}`,
        headers: { access_token, ...user }
      })
      res.json(data)

    } catch (error) {
      next(error)
    }
  }

  static async restoreArt(req, res, next) {
    try {
      const { access_token, user } = req.user;

      const { id } = req.params
      const { data } = await axios({
        method: 'post',
        url: `${appServer}arts/${id}`,
        headers: { access_token, ...user }
      })
      res.json(data)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = ControllerArt;
