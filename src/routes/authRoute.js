const express = require("express");
const User = require("../models/userModel");
const {
  signupValidator,
  loginValidator,
} = require("../Utils/validators/authValidator");

const {
  signup,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
} = require("../services/AuthService");
const UserVerification = require("../models/userVerification");
const router = express.Router();

router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);
router.post('/forgotPassword', forgotPassword);
router.post('/verifyResetCode', verifyPassResetCode);
router.put('/resetPassword', resetPassword);
router.post('/verification/:userId', async (req, res) => {
  const { userId } = req.params;  
  try {
    const result = await UserVerification.find({ userId : userId }).exec();
      if(!result){
        res.json({
          message: 'verification Qury error',
        });
      }
    if (result && result.length > 0 ) {
      const  expiresAt  = result[0].expiresAt;
      if (expiresAt < Date.now()) {
        await UserVerification.deleteOne({ userId : userId });
        res.json({
          message: 'The verification link has expired',
        });
      } else {
        // const isMatch = await bcrypt.compare(uniqueString, hashedUniqueStr);
        
          await User.findOneAndUpdate(
            { _id: userId },
            { $set: { verfied: true } },
            { new: true }
          );
          await UserVerification.deleteOne({ userId: userId });
          res.json({
            message: 'Account verified successfully !!!',
          });
        
      }
    } else {
      
      res.json({
        status: 'Failed',
        message: 'The user verification record does not exist or has already been verified',
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      status: 'Failed',
      message: 'An error occurred while processing the request',
    });
  }
});
module.exports = router;
