const { Order, Art } = require('../models')
const midtransClient = require('midtrans-client');

class ControllerOrder {
    static async createOrder(req, res, next) {
        try {
            const { customerId, artId, amount } = req.body
            if (!artId) throw { name: 'INVALID ORDER' }

            const artOrdered = await Art.findByPk(artId)

            if (!customerId || amount <= 0 || !artOrdered) throw { name: 'INVALID ORDER' }

            const newOrder = await Order.create({
                customerId, artId, amount, status: 'Unpaid', orderDate: new Date()
            })

            res.status(201).json(newOrder);

        } catch (error) {
            next(error)
        }

    }

    static async generateMidtransToken(req, res, next) {
        try {
            const { id } = req.params
            if (!id) throw { name: 'NOT FOUND' }

            const order = await Order.findOne({
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: {
                    model: Art,
                    attributes: { exclude: ['createdAt', 'updatedAt'] }
                },
                where: { id }
            })

            let snap = new midtransClient.Snap({
                // Set to true if you want Production Environment (accept real transaction).
                isProduction: false,
                serverKey: 'SB-Mid-server-YXWaZZYi87x3XeIMWIigtYDb'
            });

            let parameter = {
                transaction_details: {
                    order_id: "YOUR-ORDERID-" + Math.floor(1000000 + Math.random() * 9000000),
                    gross_amount: (order.Art.price * order.amount)
                },
                credit_card: {
                    "secure": true
                },
                customer_details: {
                    email: 'test@mail.com',
                }
            };

            const midtransToken = await snap.createTransaction(parameter)
            res.status(200).json(midtransToken);

        } catch (error) {
            console.log(error);
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
            const orders = await Order.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: {
                    model: Art,
                    attributes: { exclude: ['createdAt', 'updatedAt'] }
                }
            })
            res.status(200).json(orders)

        } catch (error) {
            next(error)
        }
    }

    static async getOneOrder(req, res, next) {
        try {
            const { id } = req.params
            const orderFound = await Order.findOne({
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: {
                    model: Art,
                    attributes: { exclude: ['createdAt', 'updatedAt'] }
                },
                where: { id }
            })
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