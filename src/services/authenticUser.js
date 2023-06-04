const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization; // Get the JWT token from the request headers
  

    if (!token) {
      // Token is missing
      return res.status(401).json({ error: "Missing Token" });
    }

    const decoded = jwt.verify(token, "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4MzYzNjUwNCwiaWF0IjoxNjgzNjM2NTA0fQ.yDbdFbfhfujlRz5CWhUOUK0oQ11OHcvCuLM0fWN8vvQ");

    // Find the user based on the decoded user ID
    const user = await User.findById(decoded.userId);

    if (!user) {
      // User not found
      return res.status(401).json({ error: "User not found" });
    }

    // Attach the user object to the request for further use
    req.user = user;

    // Call the next middleware
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = {
  authenticateUser,
};
