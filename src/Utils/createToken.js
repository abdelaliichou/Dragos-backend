const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const createToken = (payload) =>
  jwt.sign({ userId: payload }, "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4MzYzNjUwNCwiaWF0IjoxNjgzNjM2NTA0fQ.yDbdFbfhfujlRz5CWhUOUK0oQ11OHcvCuLM0fWN8vvQ", {
    expiresIn: "90d",
  });
  

module.exports = createToken;