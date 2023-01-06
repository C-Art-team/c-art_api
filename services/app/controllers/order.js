const { Order, Art } = require('../models')

class Controller {
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

}