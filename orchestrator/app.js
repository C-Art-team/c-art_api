require('dotenv').config()
const express = require("express");
const cors = require('cors')
const PORT = process.env.PORT || 4000
const { createServer } = require("http");
const { Server } = require("socket.io");
// const axios = require("axios");
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler')
// const formidableMiddleware = require('express-formidable');

const app = express();
app.use(cors())
// app.use(formidableMiddleware({
//   encoding: 'utf-8',
//   multiples: true
// }));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(routes)
app.use(errorHandler)
const httpServer = createServer(app);
const io = new Server(httpServer, { 
  cors : {
    origin: 'http://localhost:8080'
  }
});

io.on("connection", (socket) => {
  console.log('user connected')
  socket.on('disconnect', () => {
    console.log('user disconnected');
    // socket.disconnect(true)
  });

  socket.on('comment product' , productId => {
    // console.log(productId)
    socket.join(productId)
  })

  socket.on('join room', room => {
    console.log(room,'dari join room')
    socket.join(room)
  })

  socket.on('group chat', msg => {
    const {tag,text} = msg
    console.log(text , + tag, socket.id)
    io.to(tag).emit('group chat sucess',text)
  })

  socket.on('comment', async (msg) => {
    const {text,productId} = msg
    // console.log(msg)
    console.log('chat: ' + text + socket.id);
    io.to(productId).emit('chat success',text)
  });
});

httpServer.listen(PORT)