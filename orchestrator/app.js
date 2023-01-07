require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 4000;
const { createServer } = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const authGenerator = require("./helpers/auth");

const app = express();
app.use(cors({
  origin : "http://localhost:8080"
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);
app.use(errorHandler);
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8080",
  },
});

io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("comment product", async (productId) => {
    const  {data} = await axios.get(`http://localhost:4002/chats/${productId}`,{})
    socket.join(productId);
    io.to(productId).emit('load chats',data)
  });

  socket.on("join room", async (room) => {
    const {data} = await axios.get(`http://localhost:4002/chats/${room}`, {})
    socket.join(room);
    io.to(room).emit("load chats",data)
  });

  socket.on("group chat", async (payload) => {
    const userData = await authGenerator(payload.access_token);
    const { data } = await axios.post(
      "http://localhost:4002/chats",
      {payload,userData});
    io.to(payload.tag).emit("group chat sucess", data);
  });

  socket.on("comment", async (payload) => {
    console.log(payload.tag)
    const userData = await authGenerator(payload.access_token);
    const { data } = await axios.post(
      "http://localhost:4002/chats",
      {payload,userData});
      console.log(data)
    io.to(payload.tag).emit("chat success", data);
  });
});

httpServer.listen(PORT);

// module.exports = app;