const express = require('express')
const app = express()
const cors = require('cors')
const router = require('./routes/routeIndex')
const PORT = process.env.PORT || 4002
const routers = require('./routes')
const errHandler = require('./middlewares/error')

app.use(cors())
app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(routers)
app.use(errHandler)

app.use("/", router)

app.listen(PORT , () => {
  console.log(`app launching on port ${PORT}`)
})