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
     
      let format = req.files[0].originalname.split(".")[1]

      if(req.files.length === 1){
        throw {response: {data: {message:"Previews cannot be empty", status:400}}} 
      }

      let previews = req.files.slice(1)

      if(req.body.CategoryId == 1 || req.body.CategoryId == 2){
        //SoundEffect && music
        if(format !== "mp3" && format !== "wav"){
          throw {response:{data:{message:"Sound format must be mp3 or wav", status:400}}}
        }

        previews.map(el => {
          let prevFormat = el.originalname.split(".")[1]

          if ( prevFormat !== "mp3" && prevFormat !== "wav"){
            throw {response:{data:{message:"Music/SFX preview format must be mp3 or wav", status:400}}}
          }
        })

      }

      if(req.body.CategoryId == 3 || req.body.CategoryId == 4){
        //VIDEO && VFX
        if(format !== "mp4" && format !== "mov"){
          throw {response:{data:{message:"Video format must be mp4 or mov", status:400}}}
        }

        
      }

      if(req.body.CategoryId == 5 ){
        //3DMODEL
        if(format !== "fbx" && format !== "obj" && format !== "glb" && format !== "gltf"){
          throw {response:{data:{message:"3D asset format must be fbx, obj, glb or gltf", status:400}}}
        }
      }

      if(req.body.CategoryId == 6 ){
        //SCRIPT
        if(format !== "pdf"){
          throw {response:{data:{message:"Script format must be pdf", status:400}}}
        }
      }

      if(req.body.CategoryId == 7 ){
        //IMAGE ASSET
        if(format !== "png" && format !== "jpg"){
          throw {response:{data:{message:"Script format must be png or jpg", status:400}}}
        }
      }

      
      if(req.body.CategoryId != 1 && req.body.CategoryId != 2){
        previews.map(el => {
          let prevFormat = el.originalname.split(".")[1]

          if ( prevFormat !== "png" && prevFormat !== "jpg"){
            throw {response:{data:{message:"For non-sound art preview format must be png or jpg", status:400}}}
          }
        })
      }


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
      next(error)
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
