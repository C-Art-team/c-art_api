const app = require('../app')
const request = require('supertest')
const { Order } = require('../models')

const orderDummy = {
    customerId: 1,
    artId: 1,
    amount: 1,
    status: 'Unpaid',
    orderDate: new Date()
}

beforeAll(() => {
    Order.create(orderDummy)
})

afterAll(() => {
    Order.destroy({ restartIdentity: true })
})

describe("FINDALL /orders", () => {
    test("200 - Success getAll orders", (done) => {
        request(app)
            .get("/orders")
            .then((response) => {
                const { body, status } = response

                expect(status).toBe(200)
                expect(Array.isArray(body)).toBeTruthy();
                expect(body.length).toBeGreaterThan(0);
                done();
            })
            .catch((err => done(err)))
    })
})

describe("FINDONE /orders", () => {
    test("200 - Success getOne orders", (done) => {
        request(app)
            .get("/orders/1")
            .then((res) => {
                const { body, status } = res

                expect(status).toBe(200)
                expect(body).toEqual(expect.any(Object))
                expect(body).toHaveProperty('id', expect.any(Number));
                expect(body).toHaveProperty('customerId', expect.any(Number));
                expect(body).toHaveProperty('artId', expect.any(Number));
                expect(body).toHaveProperty('amount', expect.any(Number));
                expect(body).toHaveProperty('orderDate', expect.any(Date));
                expect(body).toHaveProperty('status', expect.any(String));
                done()
            })
            .catch((err => done(err)))
    })

    test("404 - Fail order not found", (done) => {
        request(app)
            .get("/orders/999")
            .then((response) => {
                const { body, status } = response

                expect(status).toBe(404)
                expect(body).toEqual(expect.any(Object))
                expect(body).toHaveProperty('status', expect.any(String));
                expect(body).toHaveProperty('message', expect.any(String));
                done()
            })
            .catch((err) => done(err))
    })
})

describe("POSTONE /orders", () => {
    const postOrderDummy = {
        customerId: 1,
        artId: 1,
        amount: 1,
        status: 'Unpaid',
        orderDate: new Date()
    }

    test("200 - Success create order", (done) => {
        request(app)
            .post("/orders")
            .send(postOrderDummy)
            .then((res) => {
                const { body, status } = res

                expect(status).toBe(201)
                expect(body).toBeInstanceOf(Object)
                expect(body).toHaveProperty("customerId", expect.any(Number))
                expect(body).toHaveProperty("artId", expect.any(Number))
                expect(body).toHaveProperty("amount", expect.any(Number))
                expect(body).toHaveProperty("status", expect.any(String))
                expect(body).toHaveProperty("orderDate", expect.any(Date))
                done()
            })
            .catch(err => done(err))
    })

    test("400 - Fail missing customerId", (done) => {
        const missingCustomerId = {
            ...postOrderDummy, customerId: ''
        }
        request(app)
            .post("/orders")
            .send(missingCustomerId)
            .then((res) => {
                const { body, status } = res
                expect(status).toBe(400)
                expect(body).toBeInstanceOf(Object)
                expect(body).toHaveProperty("status", 400)
                expect(body).toHaveProperty("message", expect.any(String))
                done()
            })
            .catch(err => done(err))
    })

    test("400 - Fail missing artId", (done) => {
        const missingArtId = {
            ...postOrderDummy, artId: ''
        }
        request(app)
            .post("/orders")
            .send(missingArtId)
            .then((res) => {
                const { body, status } = res
                expect(status).toBe(400)
                expect(body).toBeInstanceOf(Object)
                expect(body).toHaveProperty("status", 400)
                expect(body).toHaveProperty("message", expect.any(String))
                done(err)
            })
            .catch(err => done(err))

    })

    test("400 - Fail missing amount", (done) => {
        const missingAmount = {
            ...postOrderDummy, amount: ''
        }
        request(app)
            .post("/orders")
            .send(missingAmount)
            .then((res) => {
                const { body, status } = res
                expect(status).toBe(400)
                expect(body).toBeInstanceOf(Object)
                expect(body).toHaveProperty("status", 400)
                expect(body).toHaveProperty("message", expect.any(String))
                done()
            })
            .catch(err => done(err))
    })

    test("400 - Fail art not found", (done) => {
        const noArt = {
            ...postOrderDummy, artId: 999
        }
        request(app)
            .post("/orders")
            .send(noArt)
            .then((res) => {
                const { body, status } = res
                expect(status).toBe(400)
                expect(body).toBeInstanceOf(Object)
                expect(body).toHaveProperty("status", 400)
                expect(body).toHaveProperty("message", expect.any(String))
                done()
            })
            .catch(err => done(err))
    })
})

describe("PATCHONE /orders", () => {
    test("200 - Success update order status to paid", (done) => {
        request(app)
            .patch("orders/1")
            .then((res => {
                const { body, status } = res
                expect(status).toBe(200)
                expect(body).toBeInstanceOf(Object)
                expect(body).toHaveProperty("message", expect.any(String))
                done()
            }))
            .catch(err => done(err))
    })

    test("404 - Fail order not found", (done) => {
        request(app)
            .patch("/orders/999")
            .then((response) => {
                const { body, status } = response

                expect(status).toBe(404)
                expect(body).toEqual(expect.any(Object))
                expect(body).toHaveProperty('status', expect.any(String));
                expect(body).toHaveProperty('message', expect.any(String));
                done()
            })
            .catch((err) => done(err))
    })

})

describe("DELETEONE /orders", () => {
    test("200 - Success delete order", (done) => {
        request(app)
            .delete("/orders/1")
            .then((res) => {
                const { body, status } = res
                expect(status).toBe(200)
                expect(body).toEqual(expect.any(Object))
                expect(body).toHaveProperty('message', expect.any(String));
                done()
            })
            .catch(err => done(err))
    })

    test("404 - Fail order not found", (done) => {
        request(app)
            .delete("/orders/999")
            .then((res) => {
                const { body, status } = res
                expect(status).toBe(404)
                expect(body).toEqual(expect.any(Object))
                expect(body).toHaveProperty('status', expect.any(String));
                expect(body).toHaveProperty('message', expect.any(String));
                done()
            })
            .catch(err => done(err))
    })
})