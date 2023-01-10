const app = require('../app')
const request = require('supertest')

const { Chat } = require('../models')


describe("FINDALL /chats/:tag", () => {
    test("200 - Success get all chats", (done) => {
        request(app)
            .get('/chats/1')
            .then((res) => {
                const { body, status } = res
                console.log(body, status);
                done()
            })
            .catch(err => done(err))
    })
})