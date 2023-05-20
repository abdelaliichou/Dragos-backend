const { validate, Cart } = require("../models/cart");
const express = require("express");
const router = express.Router();

const { Product } = require("../models/product");

router.get("/all", async (req, res) => {
  const cart = await Cart.find().populate({
    path: "items",
    model: "products",
    select: "name price image discription rating caution -_id",
  });
  res.send(cart);
});

router.post("/add", async (req, res) => {
  const productId = req.body.productId;

  const product = Product.findById(productId);
  if (!product) return res.status(404).send("No product with this ID !");

  // Find the cart document by the user using jwt

  Cart.findOne({ user: jwtuserID }, async (err, cart) => {
    if (err) {
      console.error("Error finding cart:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (!cart) {
      // If the cart does not exist, create a new one
      cart = new Cart({
        items: [],
        quantities: [],
        total: [],
        user: jwtuserID,
      });
    }

    // Check if the product ID already exists in the items array
    const index = cart.items.indexOf(productId);
    if (index > -1) {
      console.log("Product already in cart");
      res.status(200).send("Product already in cart");
      return;
    }

    // Add the product ID to the items array
    cart.items.push(productId);
    result = await cart.save();
  });

  res.send(result);
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
