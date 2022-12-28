if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const cors = require("cors");
// const PORT = process.env.PORT || 4001;
const router = require("./routers/");
const errorHandler = require("./middlewares/errorHandler");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", router);
app.use(errorHandler);

// app.listen(PORT, () => {
//   console.log(`app launching on port ${PORT}`);
// });

module.exports = app;
