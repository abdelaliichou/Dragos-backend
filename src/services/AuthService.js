const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserVerification = require("../models/userVerification");
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const sendEmail = require('../utils/sendEmail');
const createToken = require('../Utils/createToken.js');
const User = require('../models/userModel');


// @desc    Signup
// @route   GET /api/v1/auth/signup
// @access  Public

const signup = asyncHandler(async (req, res, next) => {
  // 1- Create user
  const user = await new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  // 2- Generate token and send verification e-mail
  const NewUser = await user.save();
  const EMAIL = NewUser.email;
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const currentUrl = fullUrl.replace('/signup', '/verification/');
  const message = `Hi ${user.name},\n here is your Link to verify your Account.\n ${ currentUrl + NewUser._id}`;
      const newVerification = new UserVerification({
      userId: NewUser._id,
      createdAt: Date.now(),
      expiresAt: Date.now() + 21600000,
    });
    await newVerification.save();
  try {
        await
        newVerification.save();
        sendEmail({
      email: EMAIL,
      subject: 'NutriBoost Account verification',
      message,
    });
    res
    .json({"message":"E-mail has been send check inbox"})
    }
      catch (error) {
      console.log(error)
  }
  
});

// @desc    Login for the Admin
// @route   GET /api/auth/loginAdmin
// @access  Private

const loginAdmin = asyncHandler(async (req, res, next) => {
  // 1) check if password and email in the body (validation)
  const user = await User.findOne({ email: req.body.email });
// 2) check if user exist & check if password is correct
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError('Incorrect email or password', 401));
  } 
  // 3) generate token
  const token = createToken(user._id);

  // Delete password from response
  delete user._doc.password;
  // 4) send response to client side
  res.status(200).json({ data: user, token });
});

// @desc    Login
// @route   GET /api/v1/auth/login
// @access  Public

const login = asyncHandler(async (req, res, next) => {
  // 1) check if password and email in the body (validation)
  const user = await User.findOne({ email: req.body.email });
// 2) check if user exist & check if password is correct
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError('Incorrect email or password', 401));
  } 
  else if (!user.verfied) {
    return next(new ApiError('the account is not verified. check you e-mail inbox for a verification Link ', 401))
  }

  // 3) generate token
  const token = createToken(user._id);

  // Delete password from response
  delete user._doc.password;
  // 4) send response to client side
  res.status(200).json({ data: user, token });
});

// @desc   make sure the user is logged in
const protect = asyncHandler(async (req, res, next) => {
  // 1) Check if token exist, if exist get
  
  if (req.headers.authorization ) 
  {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return next(
      new ApiError(
        'You are not login, Please login to get access this route',
        401
      )
    ); 
  }
    // 2) Verify token (no change happens, expired token)
    const decoded = jwt.verify(token, "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4MzYzNjUwNCwiaWF0IjoxNjgzNjM2NTA0fQ.yDbdFbfhfujlRz5CWhUOUK0oQ11OHcvCuLM0fWN8vvQ");

    // 3) Check if user exists
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      return next(
        new ApiError(
          'The user that belong to this token does no longer exist',
          401
        )
      );
    }
  
    // 4) Check if user change his password after token created
    if (currentUser.passwordChangedAt) {
      const passChangedTimestamp = parseInt(
        currentUser.passwordChangedAt.getTime() / 1000,
        10
      );
      // Password changed after token created (Error)
      if (passChangedTimestamp > decoded.iat) {
        return next(
          new ApiError(
            'User recently changed his password. please login again..',
            401
          )
        );
      }
    }
  
    req.user = currentUser;
    next();
  }
else{
  res.json({"message":"no token found"});
}
});

// @desc    Authorization (User Permissions)
// ["admin", "manager"]
const allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError('You are not allowed to access this route', 403)
      );
    }
    next();
  });

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with that email ${req.body.email}`, 404)
    );
  }
  // 2) If user exist, Generate hash reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');

  // Save hashed password reset code into db
  user.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  // 3) Send the reset code via email
  const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
  try {
    await 
    sendEmail({
      email: user.email,
      subject: 'Your password reset code (valid for 10 min)',
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError('There is an error in sending email', 500));
  }

  res
    .status(200)
    .json({ status: 'Success', message: 'Reset code sent to email' });
});

// @desc    Verify password reset code
// @route   POST /api/v1/auth/verifyResetCode
// @access  Public
const verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(req.body.resetCode)
    .digest('hex');

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError('Reset code invalid or expired'));
  }

  // 2) Reset code valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: 'Success',
  });
});

// @desc    Reset password
// @route   POST /api/v1/auth/resetPassword
// @access  Public
const resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with email ${req.body.email}`, 404)
    );
  }

  // 2) Check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new ApiError('Reset code not verified', 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // 3) if everything is ok, generate token
  const token = createToken(user._id);
  res.status(200).json({ token });
});
  module.exports = {
    allowedTo,
    protect,
    login,
    loginAdmin,
    signup,
    resetPassword,
    verifyPassResetCode,
    forgotPassword,
  }
