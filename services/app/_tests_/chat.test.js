const app = require('../app')
const request = require('supertest')

const { Chat } = require('../models')

beforeEach(() => {
    jest.restoreAllMocks()
})

afterAll(async () => {
    await Chat.destroy({ truncate: true })
})

describe("FINDALL /chats/:tag", () => {
    test("200 - Success get all chats", (done) => {
        request(app)
            .get('/chats/3DModel')
            .then((res) => {
                const { body, status } = res
                expect(status).toBe(200)
                expect(Array.isArray(body)).toBeTruthy();
                done()
            })
            .catch(err => done(err))
    })

    test("500 - Internal server error", (done) => {
        jest.spyOn(Chat, 'findAll').mockRejectedValueOnce('Error')
        request(app)
            .get('/chats/3DModel')
            .then((res) => {
                const { body, status } = res
                expect(status).toBe(500)
                expect(body).toBeInstanceOf(Object);
                expect(body).toHaveProperty('status', expect.any(Number));
                expect(body).toHaveProperty('message', expect.any(String));
                done()
            })
            .catch(err => done(err))
    })
})

describe("NEWFORUM /chats", () => {

    test("200 - success post chats", (done) => {
        request(app)
            .post('/chats')
            .send({
                payload: {
                    text: 'abcde',
                    tag: '3D Model'
                },
                userData: {
                    user: {
                        username: 'agusssss'
                    }
                }
            })
            .then((res) => {
                const { body, status } = res
                expect(status).toBe(201)
                expect(Array.isArray(body)).toBeTruthy();
                expect(body.length).toBeGreaterThan(0);
                done()
            })
            .catch(err => done(err))
    })

    test("500 - Internal server error", (done) => {
        jest.spyOn(Chat, 'findAll').mockRejectedValueOnce('Error')
        request(app)
            .post('/chats/')
            .send({
                payload: {
                    text: 'abcde',
                    tag: '3D Model'
                },
                userData: {
                    user: {
                        username: 'agusssss'
                    }
                }
            })
            .then((res) => {
                const { body, status } = res
                expect(status).toBe(500)
                expect(body).toBeInstanceOf(Object);
                expect(body).toHaveProperty('status', expect.any(Number));
                expect(body).toHaveProperty('message', expect.any(String));
                done()
            })
            .catch(err => done(err))
    })
})

