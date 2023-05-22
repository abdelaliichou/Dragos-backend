const express = require('express');
const router = express.Router();
const {authenticateUser} = require("../services/authenticUser");

const {
  updateLoggedUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateUserValidator,
  getUserValidator,
  createUserValidator
} = require('../Utils/validators/UserValidator');

const {
  updateUser,
  CreatNewUser,
  updateLoggedUserPassword,
  getLoggedUserData,
  deleteUser,
  changeUserPassword,
  getUser,
  getUsers,
  uploadUserImage,
  resizeImage,
  deleteLoggedUserData,
  updateLoggedUserData
} = require('../services/userService');
const { updateCart } = require('../services/cartService');
const authService = require('../services/authService');

// these routes are for the admin 
// CRUD operation is allowed to manager or admin roles only 

router.use(authService.protect); //protect makes sure user is logged in by token decode and comparison

router.get('/getMe', getLoggedUserData, getUser);
router.put('/changeMyPassword', updateLoggedUserPassword);
router.put('/updateMe', updateLoggedUserValidator, updateLoggedUserData); //updates name e-mail and phone 
router.delete('/deleteMe', deleteLoggedUserData); // traje3 l'attribue isActive : False 
router.post("/cart/update",updateCart) 

// Admin

router.use(authService.allowedTo('admin', 'manager'));
router.put(
  '/changePassword/:id',
  changeUserPasswordValidator,
  changeUserPassword
);
router
  .route('/')
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, CreatNewUser);
router
  .route('/:id')
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;