const app = require('../app')
const request = require('supertest')
const { Community } = require('../models')

beforeEach(() => {
    jest.restoreAllMocks()
})

describe("FINDALL /communities", () => {
    test("200 - Success get communities", (done) => {
        request(app)
            .get('/communities')
            .then((response) => {
                const { body, status } = response

                expect(status).toBe(200)
                expect(Array.isArray(body)).toBeTruthy();
                expect(body.length).toBeGreaterThan(0);
                done();
            })
            .catch((err) => done(err))
    })

    test("500 - Internal server error", async () => {
        jest.spyOn(Community, 'findAll').mockRejectedValue('Error')
        return request(app)
            .get('/communities')
            .then((res) => {
                expect(res.status).toBe(500)
                expect(res.body).toHaveProperty('message', expect.any(String))
            })
            .catch((err) => {
                console.log(err)
            })
    })
})

describe("FINDONE /communities/:id", () => {
    test("200 - Success get community", (done) => {
        request(app)
            .get('/communities/1')
            .then((response) => {
                const { body, status } = response

                expect(status).toBe(200)
                expect(body).toBeInstanceOf(Object)
                expect(body).toHaveProperty("id", expect.any(Number));
                expect(body).toHaveProperty("name", expect.any(String));
                done();
            })
            .catch((err) => done(err))
    })

    test("404 - Fail community not found", (done) => {
        request(app)
            .get("/communities/999")
            .then((response) => {
                const { body, status } = response

                expect(status).toBe(404)
                expect(body).toEqual(expect.any(Object))
                expect(body).toHaveProperty('message', expect.any(String));
                done()
            })
            .catch((err) => done(err))
    })
})