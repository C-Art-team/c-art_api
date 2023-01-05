if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 4002
const routers = require('./routes')
const errHandler = require('./middlewares/errorhandler')

app.use(cors())
app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(routers)
app.use(errHandler)

module.exports = app
// app.listen(PORT , () => {
//   console.log(`app launching on port ${PORT}`)
// })