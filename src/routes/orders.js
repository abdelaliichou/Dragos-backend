const { validate, Order } = require("../models/order");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  //   const { error } = validate(req.body);
  //   if (error) return res.status(400).send(error.details[0].message);

  res.send("order is good !!!!");
});

module.exports = router;
