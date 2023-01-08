const { Art, Order } = require('../models')

const authorization = async (req, res, next) => {
    try {
        const AuthorId = req.user.id
        const { id } = req.params
        
        const art = await Art.findOne({ where: { id } })
        if (!art) throw { name: "NOT FOUND" }
        if (art.AuthorId != AuthorId) throw { name: 'UNAUTHORIZED' }
        next()

    } catch (error) {
        next(error)
    }
}

const authorizationPrice = async (req, res, next) => {
    try {
        const { price } = req.body;
        if (!price || price <= 0) throw { name: 'INVALID INPUT' }
        
        next()
    } catch (error) {
        next(error)
    }
}

const checkArtStatusInactive = async (req, res, next) => {
    try {
        const { id } = req.params

        const art = await Art.findOne({ where: { id } })
        if (art.status == 'Inactive') throw { name: "INACTIVE ART" }

        next()

    } catch (error) {
        next(error)
    }
}

const checkArtStatusActive = async (req, res, next) => {
    try {
        const { id } = req.params

        const art = await Art.findOne({ where: { id } })
        if (art.status == 'Active') throw { name: "ACTIVE ART" }
        next()

    } catch (error) {
        next(error)
    }
}
const authorizationOrder = async (req, res, next) => {
    try {
        const { id: orderId } = req.params
        const { id: userId } = req.user
        const order = await Order.findByPk(orderId)
        if (!order) throw { name: "NOT FOUND" }
        if (order.customerId != userId) throw { name: 'UNAUTHORIZED ORDER COMMAND' }
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = { authorization, checkArtStatusInactive, checkArtStatusActive, authorizationOrder, authorizationPrice }