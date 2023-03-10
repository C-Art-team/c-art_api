const app = require('../app')
const request = require('supertest')
const { Art, Preview } = require('../models')

const userDummy = {
    access_token: 1,
    id: 1,
    email: "dodol@gmail.com",
    username: "dodol26",
    preference: "Image Asset",
};

const userDummy2 = {
    access_token: 1,
    id: 2,
    email: "dodolabc@gmail.com",
    username: "dodol26",
    preference: "Image Asset",
}

const artDummy = {
    "name": "name",
    "source": "testSource",
    "price": 1234,
    "description": "testDesc",
    "AuthorId": 1,
    "status": "Active",
    "CategoryId": 1,
    "uploadedFile": [
        {
            "id": 1,
            "sourceUrl": "c-art/Screenshot (2)18581889735.png",
            "ArtId": 1,
        },
        {
            "id": 2,
            "sourceUrl": "c-art/Screenshot (2)18581889735.png",
            "ArtId": 1,
        }
    ]
}

const inactiveArt = {
    ...artDummy, status: 'Inactive', name: 'name2', AuthorId: 2
}


beforeEach(async () => {
    await Art.create(artDummy)
        .then(_ => {
            return Art.create(inactiveArt)
        })
})

afterEach(async () => {
    await Art.destroy({ truncate: true, cascade: true, restartIdentity: true })
        .then(() => {
            return Preview.destroy({ truncate: true, cascade: true, restartIdentity: true })
        })
        .catch((err) => console.log(err))
})

beforeEach(() => {
    jest.restoreAllMocks()
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
                done();
            })
            .catch((err => {
                done(err)
            }))
    })

    test("200 - Success get arts with filter and search", (done) => {
        request(app)
            .get("/arts?filter=1&search=abcd")
            .then((response) => {
                const { body, status } = response
                expect(status).toBe(200)
                expect(Array.isArray(body)).toBeTruthy();
                done();
            })
            .catch((err => {
                done(err)
            }))
    })

    test("500 - Internal server error", (done) => {
        jest.spyOn(Art, 'findAll').mockRejectedValueOnce('Error')
        request(app)
            .get('/arts')
            .then((res) => {
                expect(res.status).toBe(500)
                expect(res.body).toHaveProperty('message', expect.any(String))
                done()
            })
            .catch((err) => {
                console.log(err)
            })
    })
})

describe("FINDONE /arts", () => {
    test("200 - Success get one art with params", (done) => {
        request(app)
            .get("/arts/1")
            .then((response) => {
                const { body, status } = response
                expect(status).toBe(200)
                expect(body).toEqual(expect.any(Object))
                expect(body).toHaveProperty('id', expect.any(Number));
                expect(body).toHaveProperty('name', expect.any(String));
                expect(body).toHaveProperty('source', expect.any(String));
                expect(body).toHaveProperty('price', expect.any(Number));
                expect(body).toHaveProperty('description', expect.any(String));
                expect(body).toHaveProperty('AuthorId', expect.any(Number));
                expect(body).toHaveProperty('status', expect.any(String));
                expect(body).toHaveProperty('CategoryId', expect.any(Number));
                expect(body).toHaveProperty('Previews', expect.any(Array));
                done()
            })
            .catch((err) => {
                done(err)
            })
    })

    test("404 - Fail art not found", (done) => {
        request(app)
            .get("/arts/999")
            .then((response) => {
                const { body, status } = response

                expect(status).toBe(404)
                expect(body).toEqual(expect.any(Object))
                expect(body).toHaveProperty('message', expect.any(String));
                done()
            })
            .catch((err) => {
                done(err)
            })
    })

})

describe("PATCH /arts/:id", () => {

    test("200 - Success update art price", (done) => {
        request(app)
            .patch("/arts/1")
            .set(userDummy)
            .send({
                price: 123
            })
            .then((res) => {
                const { status, body } = res
                expect(status).toBe(200)
                expect(body).toBeInstanceOf(Object)
                expect(body).toHaveProperty("updatedArt", expect.any(Array))
                expect(body.updatedArt[0]).toEqual(1)
                done()
            })
            .catch((err => done(err)))

    })

    test("404 - Fail art not found", (done) => {
        request(app)
            .patch("/arts/999")
            .set(userDummy)
            .send({
                price: 123
            })
            .then((response) => {
                const { body, status } = response

                expect(status).toBe(404)
                expect(body).toEqual(expect.any(Object))
                expect(body).toHaveProperty('message', expect.any(String));
                done()
            })
            .catch((err) => {
                done(err)
            })
    })

    test("400 - Fail missing price", (done) => {
        request(app)
            .patch('/arts/1')
            .set(userDummy)
            .send({ price: null })
            .then((response) => {
                const { body, status } = response

                expect(status).toBe(400)
                expect(body).toEqual(expect.any(Object))
                expect(body).toHaveProperty('message', 'You must insert the correct input');
                done()
            })
            .catch((err => done(err)))

    })

    test("400 - Fail price is less than 0 or 0", (done) => {
        request(app)
            .patch('/arts/1')
            .send({ price: -1 })
            .set(userDummy)
            .then((res) => {
                const { body, status } = res

                expect(status).toBe(400)
                expect(body).toEqual(expect.any(Object))
                expect(body).toHaveProperty('message', 'You must insert the correct input');
                done()
            })
            .catch((err => done(err)))
    })

})

describe("POST /arts/:id", () => {
    test("200 - Success reactivate art", (done) => {
        request(app)
            .post("/arts/2")
            .set(userDummy2)
            .then((response) => {
                const { body, status } = response

                expect(status).toBe(200)
                expect(body).toEqual(expect.any(Object))
                expect(body).toHaveProperty('message', expect.any(String));
                done()
            })
            .catch((err) => {
                done(err)
            })
    })

    test("404 - Fail art not found", (done) => {
        request(app)
            .post("/arts/999")
            .set(userDummy)
            .then((response) => {
                const { body, status } = response

                expect(status).toBe(404)
                expect(body).toEqual(expect.any(Object))
                expect(body).toHaveProperty('message', expect.any(String));
                done()
            })
            .catch((err) => {
                done(err)
            })
    })

    test("401 - Unauthorized", (done) => {
        request(app)
            .post("/arts/2")
            .send(userDummy)
            .then((res) => {
                const { body, status } = res
                expect(status).toBe(401)
                expect(body).toEqual(expect.any(Object))
                expect(body).toHaveProperty('message', expect.any(String));
                done()
            })
            .catch((err => done(err)))
    })
})

describe("DELETEONE /arts/:id", () => {
    test("200 - Success update art status to inactive", (done) => {
        request(app)
            .delete('/arts/1')
            .set(userDummy)
            .then((res) => {
                const { body, status } = res

                expect(status).toBe(200)
                expect(body).toBeInstanceOf(Object)
                expect(body).toHaveProperty("message", expect.any(String))
                done()
            })
            .catch(err => done(err))
    })

    test("404 - Fail art not found", (done) => {
        request(app)
            .delete("/arts/999")
            .set(userDummy)
            .then((response) => {
                const { body, status } = response

                expect(status).toBe(404)
                expect(body).toEqual(expect.any(Object))
                expect(body).toHaveProperty('message', expect.any(String));
                done()
            })
            .catch((err) => {
                done(err)
            })
    })

    test("401 - Unauthorized", (done) => {
        request(app)
            .delete("/arts/1")
            .set(userDummy2)
            .then((res) => {
                const { body, status } = res
                expect(status).toBe(401)
                expect(body).toEqual(expect.any(Object))
                expect(body).toHaveProperty('message', expect.any(String));
                console.log(body);
                done()
            })
            .catch((err => done(err)))
    })

})

describe("FINDALL /myarts", () => {
    test("200 - Success findAll", (done) => {
        request(app)
            .get("/arts/myarts")
            .set(userDummy)
            .then((res) => {
                const { body, status } = res
                expect(status).toBe(200)
                expect(Array.isArray(body)).toBeTruthy();
                expect(body.length).toBeGreaterThan(0);
                done()
            })
            .catch((err => done(err)))
    })
})