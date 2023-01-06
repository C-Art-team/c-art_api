const app = require('../app')
const request = require('supertest')

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
})