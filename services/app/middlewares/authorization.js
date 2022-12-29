const { Art } = require('../models')

const authorization = async (req, res, next) => {
    try {
        // const AuthorId = req.user.id
        const { id } = req.params

        const art = await Art.findOne({ where: { id } })

        if (!art) {
            throw { name: "NOT FOUND" }
        }

        // sementara AuthorId itu 1 semua, nanti pake req user
        if (art.AuthorId !== 1) {
            throw { name: 'UNAUTHORIZED' }
        }

    } catch (error) {
        next(error)
    }
}

const checkArtStatus = async (req, res, next) => {
    try {
        const { id } = req.params

        const art = await Art.findOne({ where: { id } })
        if (art.status == 'inactive') {
            throw { name: "INACTIVE ART" }
        }

        next()

    } catch (error) {
        next(error)
    }
}

module.exports = { authorization, checkArtStatus }