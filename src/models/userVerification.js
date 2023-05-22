const mongoose = require("mongoose");

const userVerificationSchema = new mongoose.Schema({
  userId: String,
  // uniqueString: String,
  createdAt: String,
  expiresAt: String,
});

const UserVerification = mongoose.model(
  "UserVerification",
  userVerificationSchema
);

module.exports = UserVerification;
