const { Art } = require('../models')

const AuthorizationDelete = async (req, res, next) => {
    try {
        const AuthorId = req.user.id
        const { id } = req.params

        const art = await Art.findOne({ where: { id } })

        if (!art) {
            throw { name: "NOT FOUND" }
        }

        if (art.AuthorId !== AuthorId) {
            throw { name: 'UNAUTHORIZED' }
        }

        next()

    } catch (error) {
        next(error)
    }
}

module.exports = AuthorizationDelete