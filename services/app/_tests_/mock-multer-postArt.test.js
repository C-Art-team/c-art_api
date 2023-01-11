const app = require('../app')
const request = require('supertest')
const userDummy = {
    access_token: 1,
    id: 1,
    email: "dodol@gmail.com",
    username: "dodol26",
    preference: "Image Asset",
};

jest.mock('multer', () => {
    const multer = () => ({
        array: () => {
            return (req, res, next) => {
                req.body = {
                    name: 'mockName',
                    price: 123,
                    description: 'mockDesc',
                    CategoryId: 1,
                    AuthorId: 1,
                    status: 'mockStatus',

                }
                req.files = [{
                    publicUrl: 'mockUrl'
                }]
                return next()
            }
        }
    })
    multer.memoryStorage = () => jest.fn()
    return multer
})

describe("POSTONE /arts", () => {

    test("201 - created", (done) => {
        request(app)
            .post('/arts')
            .set(userDummy)
            .then(res => {
                const { status, body } = res
                expect(status).toBe(201)
                expect(body).toBeInstanceOf(Object)
                expect(body).toHaveProperty('art', expect.any(Object))
                done()
            })
            .catch(err => done(err))
    })

    test("400 - unique constraint error", (done) => {
        request(app)
            .post('/arts')
            .set(userDummy)
            .then(res => {
                const { status, body } = res
                expect(status).toBe(400)
                expect(body).toBeInstanceOf(Object)
                expect(body).toHaveProperty('status', 400)
                expect(body).toHaveProperty('message', 'Name is already used')
                done()
            })
            .catch(err => done(err))
    })
})
