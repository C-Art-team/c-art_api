require('dotenv').config()
const express = require("express");
const cors = require('cors')
const PORT = process.env.PORT || 4000
const { createServer } = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
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
    origin: '*'
  }
});

io.on("connection", (socket) => {
  console.log('user connected')
  socket.on('disconnect', () => {
    console.log('user disconnected');
    socket.disconnect(true)
  });
  
  socket.on('comment', async (msg) => {
    const {text,tag} = msg
    const {data} = await axios.post('http://localhost:4002/chats',{
      data : {text,tag}
    })

    console.log(data)
    console.log('chat: ' + msg.text + socket.id);
    io.emit('chat success',data)
  });
});

httpServer.listen(PORT)