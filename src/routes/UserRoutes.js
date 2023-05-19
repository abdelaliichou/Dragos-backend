const express = require('express');
const router = express.Router();
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


// these routes are for the admin 
// CRUD operation is allowed to manager or admin roles only 
router
  .route('/')
  .get(getUserValidator,getUsers)  
  .post(createUserValidator,CreatNewUser);

  router
  .route('/:id')
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);


  module.exports = router;