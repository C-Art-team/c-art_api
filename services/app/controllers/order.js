const { Order, Art } = require('../models')

class ControllerOrder {
    static async createOrder(req, res, next) {
        try {
            const { customerId, artId, amount } = req.body
            const artOrdered = await Art.findByPk(artId)

            if (!customerId || !artId || amount <= 0 || !artOrdered) throw { name: 'INVALID ORDER' }

            await Order.create({
                customerId, artId, amount, status: 'Unpaid', orderDate: new Date()
            })

            let snap = new midtransClient.Snap({
                // Set to true if you want Production Environment (accept real transaction).
                isProduction: false,
                serverKey: 'SB-Mid-server-koVIILNFoaXlrshKNe8179ED'
            });

            let parameter = {
                transaction_details: {
                    order_id: "YOUR-ORDERID-" + Math.floor(1000000 + Math.random() * 9000000),
                    gross_amount: 100000
                },
                credit_card: {
                    "secure": true
                },
                customer_details: {
                    email: user.email,
                }
            };

            const midtransToken = await snap.createTransaction(parameter)
            res.status(200).json(midtransToken);

        } catch (error) {
            next(error)
        }

    }

    static async patchOrderStatus(req, res, next) {
        try {
            const { id } = req.params

            const orderPaid = await Order.findByPk(id)
            if (!orderPaid) throw { name: 'NOT FOUND' }

            await orderPaid.update({ status: 'Paid' }, { where: { id } })
            res.status(200).json({
                message: `Order with id ${id} has been paid`
            })

        } catch (error) {
            next(error)
        }
    }

    static async getAllOrders(req, res, next) {
        try {
            const orders = await Order.findAll()
            res.status(200).json(orders)

        } catch (error) {
            next(error)
        }
    }

    static async getOneOrder(req, res, next) {
        try {
            const { id } = req.params
            const orderFound = await Order.findByPk(id)
            if (!orderFound) throw { name: "NOT FOUND" }
            res.status(200).json(orderFound)

        } catch (error) {
            next(error)
        }
    }

    static async cancelOrder(req, res, next) {
        try {
            const { id } = req.params
            const orderCancelled = await Order.findByPk(id)
            if (!orderCancelled) throw { name: "NOT FOUND" }

            await orderCancelled.destroy({ where: { id } })
            res.status(200).json({ message: `Order with id ${orderCancelled.id} has been cancelled` })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = ControllerOrder