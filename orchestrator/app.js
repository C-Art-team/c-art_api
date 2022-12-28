const express = require("express");
const cors = require('cors')
const PORT = process.env.PORT || 4000
const { createServer } = require("http");
const { Server } = require("socket.io");
const axios = require("axios");

const app = express();
app.use(cors())
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
  
  socket.on('chat', async (msg) => {
    const {data} = await axios.post('http://localhost:4002/chats',{
      data : {text : msg,category : '3d'}
    })

    console.log(data)
    console.log('chat: ' + msg + socket.id);
    io.emit('chat success',data)
  });
});

httpServer.listen(PORT)