// first commit
// ichou branch
const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const orders = require("./routes/orders");
const products = require("./routes/products");
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/NutryBoostDB")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

app.use(express.json());
app.use("/api/orders", orders);
app.use("/api/products", products);

const port = process.env.PORT || 4500;

app.listen(port, () => {
  console.log("server is on port : " + port);
});
