const app = require('../app')
const request = require('supertest')
const { Category } = require('../models')

beforeEach(() => {
    jest.restoreAllMocks()
})

describe("FINDALL /categories", () => {

    test("200 - Success get categories", (done) => {
        request(app)
            .get("/categories")
            .then((response) => {
                const { body, status } = response

                expect(status).toBe(200)
                expect(Array.isArray(body)).toBeTruthy();
                expect(body.length).toBeGreaterThan(0);
                done();
            })
            .catch((err => done(err)))
    })

    test("500 - Internal server error", async () => {
        jest.spyOn(Category, 'findAll').mockRejectedValue('Error')
        return request(app)
            .get('/categories')
            .then((res) => {
                expect(res.status).toBe(500)
                expect(res.body).toHaveProperty('status', expect.any(Number))
                expect(res.body).toHaveProperty('message', expect.any(String))
            })
            .catch((err) => {
                console.log(err)
            })
    })
})
