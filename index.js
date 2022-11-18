const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const url = process.env.MONGO_URL;

const app = express();

mongoose.connect(url, { useNewUrlParser: true }, { useUnifiedTopology: true });
const con = mongoose.connection;

con.on("open", () => {
  console.log("connected...");
});

app.use(express.json());
app.use(cors());
const testRouter = require("./routes/test");
app.use("/api", testRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server up and working" + PORT);
});
