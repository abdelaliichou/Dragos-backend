const express = require('express');
const {
  signupValidator,
  loginValidator,
} = require('../Utils/validators/authValidator');

const {
  signup,
  login
//   forgotPassword,
//   verifyPassResetCode,
//   resetPassword,
} = require('../services/AuthService');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', loginValidator, login);
router.post('/forgotPassword', forgotPassword);
router.post('/verifyResetCode', verifyPassResetCode);
router.put('/resetPassword', resetPassword);

module.exports = router;