const express = require("express");
const router = express.Router();
const {
  addToWishlist,
  removeFromWishlist,
  getWishList,
} = require("../services/wishListService");

const {
  updateLoggedUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateUserValidator,
  getUserValidator,
  createUserValidator,
} = require("../Utils/validators/UserValidator");

const {
  updateUser,
  CreatNewManager,
  updateLoggedUserPassword,
  getLoggedUserData,
  deleteUser,
  changeUserPassword,
  getUser,
  uploadUserImage,
  resizeImage,
  deleteLoggedUserData,
  updateLoggedUserData,
} = require("../services/userService");
const { updateCart, displayCart } = require("../services/cartService");
const authService = require("../services/AuthService");

// these routes are for the admin
// CRUD operation is allowed to manager or admin roles only

router.use(authService.protect); //protect makes sure user is logged in by token decode and comparison

router.get("/getMe", getLoggedUserData, getUser);
router.put("/changeMyPassword", updateLoggedUserPassword);
router.put("/updateMe", updateLoggedUserValidator, updateLoggedUserData); //updates name e-mail and phone
// traje3 l'attribue isActive : False
router.post("/cart/update", updateCart);
router.get("/cart/displayCart", displayCart);
router.post("/addToWishList", addToWishlist);
router.get("/getWishList", getWishList);
router.post("/removeFromWishList", removeFromWishlist);
router.post("/uploadUserImage", resizeImage, uploadUserImage);

// Admin

router.use(authService.allowedTo("admin", "manager"));
router.delete("/deleteMe", deleteLoggedUserData);
router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);
router.route("/Adimn/creatManager").post(createUserValidator, CreatNewManager);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
