const express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 4002

app.use(cors())
app.use(express.urlencoded({extended : true}))
app.use(express.json())

app.listen(PORT , () => {
  console.log(`app launching on port ${PORT}`)
})