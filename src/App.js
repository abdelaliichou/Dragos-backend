// first commit
// ichou branch
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(express.json);

const port = process.env.PORT || 4500;

app.listen(port, () => {
  console.log("server is on port : " + port);
});
