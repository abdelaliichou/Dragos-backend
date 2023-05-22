// const User = require("../models/userModel");
// const jwt = require("jsonwebtoken");

// const authenticateUser = async (req, res, next) => {
//   // Get the JWT token from the request headers
//   const token =
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDZhNjBmMmFjOTA3Njc1NDM2Njg4MWUiLCJpYXQiOjE2ODQ2OTM0MDIsImV4cCI6MTY5MjQ2OTQwMn0.C6DcG_nVOwFISjtv9b6WOc_8ELwmqZODppN5Um1zh6w";
//   const decoded = await jwt.verify(
//     token,
//     "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4MzYzNjUwNCwiaWF0IjoxNjgzNjM2NTA0fQ.yDbdFbfhfujlRz5CWhUOUK0oQ11OHcvCuLM0fWN8vvQ"
//   );
//   if (!token) {
//     // Token is missing
//     return res.status(401).json({ error: "Missing Token" });
//   }

//   try {
//     await User.findById(decoded.userId, (err, user) => {
//       if (err || !user) {
//         return res.status(401).json({ error: "User not found" });
//       }

//       // Attach the user object to the request for further use
//       req.user = user;

//       // Call the next middleware
//       next();
//     });
//   } catch (err) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }
// };
// module.exports = {
//   authenticateUser,
// };
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization; // Get the JWT token from the request headers
    // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDZhYTI5NTM1YjJhMDA0MjFmYTEyNTgiLCJpYXQiOjE2ODQ3MTAzNDUsImV4cCI6MTY5MjQ4NjM0NX0.pd88_1MriegCLeRh0-JB8OXRqYVciPvtscQ5K4rHe-Q";

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
