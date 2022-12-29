const { Art, Preview, sequelize } = require("../models")

class ControllerArt {
    static async createArt(req, res, next) {
        const t = await sequelize.transaction()
        try {

            let { name, price, description, CategoryId } = req.body

            ////REQ.FILES RECIEVES AN ARRAY OF 4 OBJECTS. FIRST IS SOURCE FOR ART, THE REST IS FOR PREVIEWS
            let art = await Art.create({ name, price, description, AuthorId: 1, source: req.files[0].path, CategoryId })
            let previews = req.files.slice(1)

            let convertedPreviews = previews.map(el => {
                el.sourceUrl = el.path
                el.ArtId = art.dataValues.id
                return el
            })

            let newPreviews = await Preview.bulkCreate(convertedPreviews)

            t.commit()
            art.dataValues.Previews = newPreviews
            res.status(201).json({ art })
        } catch (error) {
            next(error)
        }
    }

    static async getArts(req, res, next) {
        try {

            let arts = await Art.findAll({ include: [{ model: Preview }] })
            // console.log(arts);
            res.status(200).json(arts)
        } catch (error) {
            console.log(error);
            // next(error)
        }
    }

    static async getOneArt(req, res, next) {
        try {

            let { id } = req.params
            let art = await Art.findOne({ where: { id }, include: [{ model: Preview }] })

            if (!art) {
                throw { name: "NOT FOUND" }
            }

            res.status(200).json(art)
        } catch (error) {
            next(error)
        }
    }

    static async deleteArt(req, res, next) {
        try {
            const { id } = req.params

            // kalo bukan soft delete, kek gini :
            // await Art.destroy({ where: { id } })
            // kalo mau soft delete kyknya mesti tambahin properti status di model Art, status kek active/inactive etc.

        } catch (error) {
            next(error)
        }
    }

    
}

module.exports = ControllerArt