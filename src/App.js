const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const orders = require("./routes/orders");
const products = require("./routes/products");
const categories = require("./routes/categories");
const payments = require("./routes/payments");
const promotions = require("./routes/promotions");
const app = express();
const userRoute = require("./routes/UserRoutes");
const authRoute = require("./routes/authRoute");
const dbConnection = require("./config/dbConnection");
const ApiError = require("./Utils/apiError.js");
const globalError = require("./middlewares/errorMiddleware");


// mongoose
//   .connect("mongodb://127.0.0.1:27017/NutryBoostDB")
//   .then(() => console.log("Connected to MongoDB..."))
//   .catch((err) => console.error("Could not connect to MongoDB..."));

// Connect with db
dbConnection();

  app.use(express.json());
app.use("/api/orders", orders);
app.use("/api/products", products);
app.use("/api/categories", categories);
app.use("/api/payments", payments);
app.use("/api/promotions", promotions);
app.use("/api/users", userRoute);
app.use('/api/auth', authRoute);

// Global error handling middleware for express
app.use(globalError);

app.all('*', (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

const port = process.env.PORT || 4500;

app.listen(port, () => {
  console.log("server is on port : " + port);
});

// Handle rejection outside express
process.on('unhandledRejection', (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});