const express = require("express");
const bcrypt = require("bcrypt");
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
const { authenticateUser } = require("../services/authenticUser");
const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyResetCode", verifyPassResetCode);
router.put("/resetPassword", resetPassword);
router.post("/verification/:userId", async (req, res) => {
  const Id = req.params.userId;
  try {
    const result = await UserVerification.findOne({ userId: Id }).exec();
    if (!result) {
      res.json({
        message: "verification Qury error",
      });
    }
    if (result && result.length > 0) {
      // crossOriginIsolated.log(userId);
      // const hashedUniqueStr = result[0].uniqueString;
      const expiresAt = result[0].expiresAt;

      if (expiresAt < Date.now()) {
        await UserVerification.deleteOne({ userId: userId });
        res.json({
          message: "The verification link has expired",
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
          message: "Account verified successfully !!!",
        });
      }
    } else {
      res.json({
        status: "Failed",
        message:
          "The user verification record does not exist or has already been verified",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      status: "Failed",
      message: "An error occurred while processing the request",
    });
  }
});

// router.post('/verification/:userId/:UniqueString', async (req, res) => {
//   try {
//     const { userId, UniqueString } = await  req.params;

//     const result = await UserVerification.findById({ userId });

//     if (result.length > 0) {
//       const hashedUniqueStr = result[0].UniqueString;
//       const { expiresAt } = result[0];

//       if (expiresAt > Date.now()) {
//         await UserVerification.deleteOne({ userId });
//         res.json({
//           message: 'The verification link has expired',
//         });
//       }
//       else {
//         const result = await bcrypt.compare(UniqueString, hashedUniqueStr);
//         if (result) {
//           await User.updateOne({ _id: userId }, { verfied: true });
//           await UserVerification.deleteOne({ userId });
//           res.json({
//             message: 'Email verified successfully :)',
//           });
//         }
//       }
//     } else {
//       res.json({
//         status: 'Failed',
//         message: 'The user verification record does not exist or has already been verified',
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     res.json({
//       status: 'Failed',
//       message: 'An error occurred while processing the request',
//     });
//   }
// });

// router.post("/verification/:userId/:UniqueString", (req, res) => {
//   let { userId, UniqueString } = req.params;
//   UserVerification.findById({ userId })
//     .then((Result)=>{
//       if (Result.length > 0) {
//         const hashedUniqueStr = Result[0].UniqueString;
//         const {expiresAt} = Result[0];
//         if (expiresAt > Date.now()) {
//         UserVerification
//         .deleteOne({userId})
//         .then()
//         .catch((err)=>{
//           console.log(err);
//         })
//           res.json({
//             "message" : "the verification link has expired"
//           })
//         }
//         else{
//           bcrypt.compare(UniqueString ,hashedUniqueStr)
//           .then((result)=>{
//             if(result){
//               //setting the isVerified attribute in user to True
// User.updateOne({_id :userId },{verfied : true})
// .then(
//   UserVerification.deleteOne({userId})
//   .then(()=>{
// res.json({"message" : "e_mail verified successfully :)"})
//     }
//   )
// )
// .catch()
//             }
//           })
//           .catch();
//         }

//       }

//       else {
//         res.json({
//           "status" : "Failed",
//           "message" : "the user verification record doesn't exist or has already been verified "
//         })

//       }
//     })
//     .catch(() => {
//       res.json({
//         "status": "Failed",
//         "message": "user verification record not found"
//       });
//     });
// });

module.exports = router;
