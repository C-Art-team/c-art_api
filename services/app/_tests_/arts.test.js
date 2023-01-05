const app = require('../app')
const request = require('supertest')
const { Art, Preview } = require('../models')

const artDummy = {
    "name": "testName",
    "source": "testSource",
    "price": 1234,
    "description": "testDesc",
    "AuthorId": 1,
    "status": "Active",
    "CategoryId": 1,
    "Previews": [
        {
            "id": 1,
            "sourceUrl": "c-art/Screenshot (2)18581889735.png",
            "ArtId": 1,
        }
    ]
}

beforeAll(() => {
    Art.create(artDummy)
})

afterAll(() => {
    Art.destroy({ truncate: true, cascade: true, restartIdentity: true })
        .then(() => {
            return Preview.destroy({ truncate: true, cascade: true, restartIdentity: true })
        })
        .catch((err) => console.log(err))
})

describe("FINDALL /arts", () => {

    test("200 - Success get arts", (done) => {
        request(app)
            .get("/arts")
            .then((response) => {
                const { body, status } = response

                expect(status).toBe(200)
                expect(Array.isArray(body)).toBeTruthy();
                expect(body.length).toBeGreaterThan(0);
                console.log(body);
                done();
            })
            .catch((err => {
                done(err)
            }))
    })
})

describe("FINDONE /arts", () => {
    test("200 - Success get one art with params", (done) => {
        request(app)
            .get("arts/1")
            .then((response) => {
                const { body, status } = response

                expect(status).toBe(200)
                expect(body).toEqual(expect.any(Object))
                expect(body).toHaveProperty('id', 'Internal Server Error');
                done()
            })
            .catch((err) => {
                done(err)
            })
    })


})

