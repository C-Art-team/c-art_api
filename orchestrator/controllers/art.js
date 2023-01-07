const axios = require("axios");
const appServer = process.env.APP_URL;
const FormData = require("form-data");

class ControllerArt {
  static async getArts(req, res, next) {
    try {
      const { data } = await axios({
        url: appServer + "arts",
        method: "get",
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

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async addItem(req, res, next) {
    try {
      console.log(req.files);
      let itemData = new FormData();
      console.log(req.body);
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
        },
      });

      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).end();
    }
  }
}

module.exports = ControllerArt;
