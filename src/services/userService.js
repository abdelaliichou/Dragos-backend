const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const factory = require("./handlersFactory");
const User = require("../models/userModel");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
// const SendVerificationEmail = ({ _id, email }, res) => {
//   const currentUrl = "http://localhost:6000";
//   const uniquString = uuidv4() + _id;
//   const mailOptions = {
//     from: process.env.AUTH_EMAIL,
//     to: email,
//     subject: "verifyf your email",
//     html: `<p>Verify your email to complet the account virification process</p><p>This link will expire in <b>6 hours </b>.</p><p>Press<a href=${
//       currentUrl + "users/verify/" + _id + "/" + uniquString
//     }>here</a> to proceed.</p>`,
//   };
// };
// //hash the unisting
// const saltRounds = 10;
// bcrypt.hash(uniqueString, saltRounds).then((hashedUniqueString) => {
//   // set values in userVerification collection
//   const newVerification = new UserVerification({
//     userId: _id,
//     uniqueString: hashedUniqueString,
//     createdAt: Date.now(),
//     expiresAt: Date.now() + 21600000,
//   });
//   newVerification.save().then(() => {
//     transporter
//       .sendMail(mailOptions)
//       .then()
//       .catch((error) => {
//         console.log(error);
//         res.json({
//           status: "FAILED",
//           message: "Verification email failed",
//         });
//       })
//       .catch((error) => {
//         console.log(error);
//         res.json({});
//       });
//   });
// });

// // 1)_ this is for the email virifiyer
// let transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.AUTH_EMAIL,
//     pass: process.env.AUTH_PASSWD,
//   },
// });

const CreatNewUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !password || !email)
    return res
      .status(400)
      .json({ message: "Username and email and password are required." });
  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);

    //create and store the new user
    const result = await User.create({
      name: name,
      email: email,
      password: hashedPwd,
    });
    console.log(result);
    //email virifyer initialisation
    // transporter.verify((err, success) => {
    //   if (err) {
    //     console.log(err);
    //   }
    //   console.log(`Email verifyer is ready ? `);
    // });
    // SendVerificationEmail(result, res);
    // res.status(201).json({ success: `New user ${name} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Upload single image
const uploadUserImage = uploadSingleImage("profileImg");

// Image processing
const resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);

    // Save image into our db
    req.body.profileImg = filename;
  }

  next();
});

// @desc    Get list of users
// @route   GET /api/v1/users
// @access  Private/Admin
const getUsers = factory.getAll(User);

// @desc    Get specific user by id
// @route   GET /api/v1/users/:id
// @access  Private/Admin
const getUser = factory.getOne(User);

// @desc    Update specific user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug, // this is to prevente special caracteres
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(console.log(`No document for this id ${req.params.id}`));
  }
  res.status(200).json({ data: document });
});

const changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(console.log(`No document for this id ${req.params.id}`));
  }
  res.status(200).json({ data: document });
});

// @desc    Delete specific user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
const deleteUser = factory.deleteOne(User);

// @desc    Get Logged user data
// @route   GET /api/v1/users/getMe
// @access  Private/Protect
const getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc    Update logged user password
// @route   PUT /api/v1/users/updateMyPassword
// @access  Private/Protect
const updateLoggedUserPassword = asyncHandler(async (req, res) => {
  // 1) Update user password based user payload (req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
});
// @desc    Update logged user data (without password, role)
// @route   PUT /api/v1/users/updateMe
// @access  Private/Protect
const updateLoggedUserData = async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );

  if (!updatedUser) return res.status(400).send("Id is not valid");

  res.status(200).json({ data: updatedUser });
};
// @desc    Deactivate logged user
// @route   DELETE /api/v1/users/deleteMe
// @access  Private/Protect
const deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: "Success" });
});

module.exports = {
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
  updateLoggedUserData,
};
