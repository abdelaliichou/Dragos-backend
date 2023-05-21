const { validate, Order } = require("../models/order");
const express = require("express");
const router = express.Router();

const { Product } = require("../models/product");

router.get("/all", async (req, res) => {
  const order = await Order.find()
    .populate({
      path: "products.product_id",
      model: "products",
      select: "name price image -_id",
    })
    .populate({
      path: "payment_id",
      model: "payment",
      select: "type -_id",
    });
  res.send(order);
});

// update status
// add note
// add payment

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if all products are valid product IDs

  const productIds = req.body.products;
  if (!productIds)
    return res.status(400).send("You can't do an order with 0 product!");
  const invalidProductIds = [];

  for (let i = 0; i < productIds.length; i++) {
    const product = await Product.findById(productIds[i].product_id);
    if (!product) invalidProductIds.push(productIds[i].product_id);
  }

  if (invalidProductIds.length > 0) {
    return res
      .status(400)
      .send(`Invalid product IDs: ${invalidProductIds.join(", ")}`);
  }

  // overriding the _id by the product_id

  for (let i = 0; i < productIds.length; i++) {
    productIds[i]._id = productIds[i].product_id;
  }

  let order = new Order({
    status: req.body.status,
    state: req.body.state,
    notes: req.body.notes,
    city: req.body.city,
    country: req.body.country,
    address: req.body.address,
    zip: req.body.zip,
    date: req.body.date,
    total: req.body.total,
    user: req.body.user,
    payment_id: req.body.payment_id,
    products: req.body.products,
  });

  result = await order.save();

  res.send(result);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if all products are valid product IDs

  const productIds = req.body.products;
  if (!productIds)
    return res.status(400).send("You can't do an order with 0 product!");
  const invalidProductIds = [];

  for (let i = 0; i < productIds.length; i++) {
    const product = await Product.findById(productIds[i].product_id);
    if (!product) invalidProductIds.push(productIds[i].product_id);
  }

  if (invalidProductIds.length > 0) {
    return res
      .status(400)
      .send(`Invalid product IDs: ${invalidProductIds.join(", ")}`);
  }

  // overriding the _id by the product_id

  for (let i = 0; i < productIds.length; i++) {
    productIds[i]._id = productIds[i].product_id;
  }

  let order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
      state: req.body.state,
      notes: req.body.notes,
      city: req.body.city,
      country: req.body.country,
      address: req.body.address,
      zip: req.body.zip,
      date: req.body.date,
      total: req.body.total,
      user: req.body.user,
      payment_id: req.body.payment_id,
      products: req.body.products,
    },
    {
      new: true,
    }
  );

  if (!order)
    return res.status(404).send("The order with the given ID was not found.");

  res.send(order);
});

router.delete("/:id", async (req, res) => {
  const order = await Order.findByIdAndRemove(req.params.id);

  if (!order)
    return res.status(404).send("The order with the given ID was not found.");

  res.send(order);
});

router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate({
      path: "products.product_id",
      model: "products",
      select: "name price image -_id",
    })
    .populate({
      path: "payment_id",
      model: "payment",
      select: "type -_id",
    });

  if (!order)
    return res.status(404).send("The order with the given ID was not found.");

  res.send(order);
});

module.exports = router;
