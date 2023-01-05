const app = require('../app')
const request = require('supertest')
const { sequelize } = require('../models')
// const { queryInterface } = sequelize

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
            .catch((err => {
                done(err)
            }))
    })
    
})
