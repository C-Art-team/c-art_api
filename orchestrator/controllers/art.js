const axios = require('axios')
const appServer = process.env.APP_URL

class ControllerArt {
    static async getArts(req, res, next) {
        try {

            const { data } = await axios({
                url: appServer + "arts",
                method: "get",
            })

            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }

    static async getArtDetail(req, res, next) {
        try {
            let { id } = req.params


            const { data } = await axios({
                url: appServer + "arts/" + id,
                method: "get"
            })

            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }

    static async addItem(req, res, next) {
        try {
            // console.log(req.fields);
            // console.log(req.files);
            // console.log(req.files.uploadedFile);
            let itemData = new FormData()
            itemData.append("uploadedFile", req.files.uploadedFile)
            itemData.append("name", req.fields.name)
            itemData.append("price", req.fields.price)
            itemData.append("description", req.fields.description)
            itemData.append("CategoryId", req.fields.CategoryId)
            // console.log(itemData);

            // const response = await fetch(appServer + "arts", {
            //     body: itemData ,
            //     method: "post",
            //     files: itemData.uploadedFile
            // })

            const { data } =await axios.post(appServer + "arts", itemData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            console.log(data);
            // const data = await JSON.parse(response)
            res.status(201).json("test")
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}


module.exports = ControllerArt