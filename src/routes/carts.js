const { validate, Cart } = require("../models/cart");
const express = require("express");
const router = express.Router();

router.get("/all", async (req, res) => {
  const cart = await Cart.find();
  res.send(cart);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // here i need to get the user from the jwt

  let cart = new Cart({
    items: req.body.items,
    quantities: req.body.quantities,
    total: req.body.total,
    // user: req.body.user, jwtttttttttttt
  });

  result = await cart.save();

  res.send(result);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // here i need to get the user from the jwt

  let cart = await Cart.findByIdAndUpdate(
    req.params.id,
    {
      items: req.body.items,
      quantities: req.body.quantities,
      total: req.body.total,
      // user: req.body.user, jwtttttttttttt
    },
    {
      new: true,
    }
  );

  if (!cart)
    return res.status(404).send("The cart with the given ID was not found.");

  res.send(cart);
});

router.delete("/:id", async (req, res) => {
  const cart = await Cart.findByIdAndRemove(req.params.id);

  if (!cart)
    return res.status(404).send("The cart with the given ID was not found.");

  res.send(cart);
});

router.get("/:id", async (req, res) => {
  const cart = await Cart.findById(req.params.id);

  if (!cart)
    return res.status(404).send("The cart with the given ID was not found.");

  res.send(cart);
});

module.exports = router;
