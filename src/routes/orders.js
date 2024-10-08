const { validateOrder, Order } = require("../models/order");
const express = require("express");
const router = express.Router();
const authService = require("../services/AuthService");

const { Product } = require("../models/product");

router.get("/all", authService.protect, async (req, res) => {
  const order = await Order.find()
    .populate({
      path: "products.product_id",
      model: "product",
      select: "name price image -_id",
    })
    .populate({
      path: "user",
      model: "User",
      select: "name -_id",
    });
  res.send(order);
});

// update status

router.post(
  "/status/:id",
  [authService.protect, authService.allowedTo("admin", "manager")],
  async (req, res) => {
    const order_id = req.params.id;
    const newStatus = req.body.status;

    const order = await Order.findById(order_id);

    if (!order) return res.status(404).send("No order found with this id");

    if (!newStatus) return res.status(404).send("Please enter a status");

    order.status = newStatus;

    result = await order.save();

    res.send(result);
  }
);

// add note

router.post(
  "/notes/:id",
  [authService.protect, authService.allowedTo("admin", "manager")],
  async (req, res) => {
    const order_id = req.params.id;
    const newNote = req.body.notes;

    const order = await Order.findById(order_id);

    if (!order) return res.status(404).send("No order found with this id");

    if (!newNote) return res.status(404).send("Please enter a note");

    order.notes = newNote;

    result = await order.save();

    res.send(result);
  }
);

//TODO  check what the fuck is this

router.post("/", authService.protect, async (req, res) => {
  const { error } = validateOrder(req.body);
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

//TODO waaach dir hadi rani dertlha allow ll admin w manager na7ihom la Kant machi hakdak

router.put(
  "/:id",
  [authService.protect, authService.allowedTo("admin", "manager")],
  async (req, res) => {
    const { error } = validateOrder(req.body);
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
  }
);

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
      model: "product",
      select: "name price image -_id",
    })
    .populate({
      path: "user",
      model: "User",
      select: "name -_id",
    });

  if (!order)
    return res.status(404).send("The order with the given ID was not found.");

  res.send(order);
});

module.exports = router;
