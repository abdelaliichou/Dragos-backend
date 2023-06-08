const { validatePayment, Payment } = require("../models/payment");
const express = require("express");
const router = express.Router();

const { User } = require("../models/userModel");

router.get("/all", async (req, res) => {
  const payment = await Payment.find().sort("name");
  res.send(payment);
});

router.post("/", async (req, res) => {
  const { error } = validatePayment(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.user);
  if (!user) return res.status(400).send("Invalid user ID !");

  let payment = new Payment({
    user: req.body.user,
    type: req.body.type,
    date: req.body.date,
  });

  result = await payment.save();

  res.send(result);
});

// there is not update for the payement

// router.put("/:id", async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   let pa = await Category.findByIdAndUpdate(
//     req.params.id,
//     {
//       name: req.body.name,
//       image: req.body.image,
//     },
//     {
//       new: true,
//     }
//   );

//   if (!category)
//     return res
//       .status(404)
//       .send("The category with the given ID was not found.");

//   res.send(category);
// });

router.delete("/:id", async (req, res) => {
  const payment = await Payment.findByIdAndRemove(req.params.id);

  if (!payment)
    return res.status(404).send("The payment with the given ID was not found.");

  res.send(payment);
});

router.get("/:id", async (req, res) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment)
    return res.status(404).send("The payment with the given ID was not found.");

  res.send(payment);
});

module.exports = router;
