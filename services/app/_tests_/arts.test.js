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

// describe("POSTONE /arts", () => {
//     test("201 - created", (done) => {
//         const newArtDummy = {
//             ...artDummy, name: 'newName'
//         }

//         request(app)
//             .post('/arts')
//             .send(newArtDummy)
//             .then((res) => {
//                 console.log(res);
//                 // if (err) return done(err);
//                 const { body, status } = res;
//                 const {art} = body
//                 expect(status).toBe(201);
//                 expect(art).toEqual(expect.any(Object));
//                 expect(art).toHaveProperty('id', expect.any(Number));
//                 expect(art).toHaveProperty('name', expect.any(String));
//                 expect(art).toHaveProperty('source', expect.any(String));
//                 expect(art).toHaveProperty('price', expect.any(Number));
//                 expect(art).toHaveProperty('description', expect.any(String));
//                 expect(art).toHaveProperty('AuthorId', expect.any(Number));
//                 expect(art).toHaveProperty('status', expect.any(String));
//                 expect(art).toHaveProperty('CategoryId', expect.any(Number));
//                 expect(art).toHaveProperty('Previews', expect.any(Array));
//                 return done();
//               })
//               .catch(err => console.log(err))
//     })
// })

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

    test("404 - art not found", (done) => {
        request(app)
            .get("/arts/2")
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

// describe("PUTONE /arts/:id", () => {

// })

describe("DELETEONE /arts/:id", () => {
    
})