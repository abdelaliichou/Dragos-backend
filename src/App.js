const express = require("express");
const dbConnection = require("./config/dbConnection");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const PORT = process.env.PORT || 8000;
const app = express();
const userRoute = require("./routes/UserRoutes");
const authRoute = require("./routes/authRoute");


// Connect with db
dbConnection();
// Mount Routes
app.use(express.json());

app.use("/api/users", userRoute);
app.use('/api/auth', authRoute);



// Global error handling middleware for express
app.use(globalError);

app.all('*', (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

const server = app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});

// Handle rejection outside express
process.on('unhandledRejection', (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});