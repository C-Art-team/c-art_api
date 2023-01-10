const { Order, Art } = require('../models')
const midtransClient = require('midtrans-client');

class ControllerOrder {
    static async createOrder(req, res, next) {
        try {
            const customerId = req.user.id
            const { artId, amount } = req.body
            if (!artId) throw { name: 'INVALID ORDER' }

            const artOrdered = await Art.findByPk(artId)
            
            if (!customerId || amount <= 0 || !artOrdered || artOrdered.AuthorId === customerId) throw { name: 'INVALID ORDER' }

            console.log(customerId, 'cust id');
            console.log(amount, 'amount');
            console.log(artOrdered, 'artOrdered');
            console.log(artId, 'art idddddd');

            const newOrder = await Order.create({
                customerId, artId, amount, status: 'Unpaid', orderDate: new Date()
            })

            res.status(201).json(newOrder);

        } catch (error) {
            console.log(error);
            next(error)
        }

    }

    static async generateMidtransToken(req, res, next) {
        try {
            const { id } = req.params
            const email = req.user.email
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
                serverKey: process.env.MIDTRANS_TOKEN
            });

            let parameter = {
                transaction_details: {
                    // order_id: "YOUR-ORDERID-" + Math.floor(1000000 + Math.random() * 9000000),
                    order_id: `${id}-${new Date().getTime()}`,
                    gross_amount: (order.Art.price * order.amount)
                },
                credit_card: {
                    "secure": true
                },
                customer_details: {
                    email,
                }
            };

            const midtransToken = await snap.createTransaction(parameter)
            res.status(200).json(midtransToken);

        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    static async patchOrderStatus(req, res, next) {
        try {
            const { id } = req.params

            await Order.update({ status: 'Paid' }, { where: { id } })
            res.status(200).json({
                message: `Order with id ${id} has been paid`
            })

        } catch (error) {
            next(error)
        }
    }

    static async getAllOrders(req, res, next) {
        try {
            const customerId = req.user.id
            const orders = await Order.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: {
                    model: Art,
                    attributes: { exclude: ['createdAt', 'updatedAt'] }
                },
                where: { customerId }
            })
            res.status(200).json(orders)
        } catch (error) {
            next(error)
        }
    }

    static async getOneOrder(req, res, next) {
        try {
            const { id } = req.params
            const customerId = req.user.id
            const orderFound = await Order.findOne({
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: {
                    model: Art,
                    attributes: { exclude: ['createdAt', 'updatedAt'] }
                },
                where: { id, customerId }
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
            const customerId = req.user.id

            await Order.destroy({ where: { id, customerId } })
            res.status(200).json({ message: `Order with id ${id} has been cancelled` })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = ControllerOrder