const { validate, Reception } = require("../models/reception");
const express = require("express");
const router = express.Router();

const { Supplier } = require("../models/supplier");
const { Product } = require("../models/product");

router.get("/all", async (req, res) => {
  const reception = await Reception.find()
    .populate({
      path: "products.receivedItem",
      model: "product",
      select: "name price image -_id",
    })
    .populate({
      path: "supplier_id",
      model: "Supplier",
      select: "name email contactPerson phoneNumber address -_id",
    });
  res.send(reception);
});

router.post("/add", async (req, res) => {
  const reception_id = req.body.reception_id;
  const receivedItem = req.body.product_id;
  const receivedPrice = req.body.price;
  const receivedQuantity = req.body.quantity;

  const reception = await Reception.findById(reception_id);
  if (!reception) return res.status(400).send("Invalid reception ID !");

  const product = await Product.findById(receivedItem);
  if (!product) return res.status(400).send("Invalid product ID !");

  if (!receivedPrice) return res.status(400).send("please insert a Price !");

  if (!receivedQuantity)
    return res.status(400).send("please insert a Quantity !");

  reception.products.push({
    receivedItem,
    receivedQuantity,
    receivedPrice,
  });

  result = await reception.save();

  res.send(result);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const supplier = await Supplier.findById(req.body.supplier_id);
  if (!supplier) return res.status(400).send("Invalid supplier ID !");

  let reception = new Reception({
    arrivalDate: req.body.arrivalDate,
    supplier_id: req.body.supplier_id,
    products: req.body.products,
    receivedTotal: req.body.receivedTotal,
    receivedValue: req.body.receivedValue,
    receivedBy: req.body.receivedBy,
    notes: req.body.notes,
  });

  result = await reception.save();

  res.send(result);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const supplier = await Supplier.findById(req.body.supplier_id);
  if (!supplier) return res.status(400).send("Invalid supplier ID !");

  let reception = await Reception.findByIdAndUpdate(
    req.params.id,
    {
      arrivalDate: req.body.arrivalDate,
      supplier_id: req.body.supplier_id,
      products: req.body.products,
      receivedTotal: req.body.receivedTotal,
      receivedValue: req.body.receivedValue,
      receivedBy: req.body.receivedBy,
      notes: req.body.notes,
    },
    {
      new: true,
    }
  );

  if (!reception)
    return res
      .status(404)
      .send("The reception with the given ID was not found.");

  res.send(reception);
});

router.delete("/:id", async (req, res) => {
  const reception = await Reception.findByIdAndRemove(req.params.id);

  if (!reception)
    return res
      .status(404)
      .send("The reception with the given ID was not found.");

  res.send(reception);
});

router.get("/:id", async (req, res) => {
  const reception = await Reception.findById(req.params.id)
    .populate({
      path: "products.receivedItem",
      model: "products",
      select: "name price image -_id",
    })
    .populate({
      path: "supplier_id",
      model: "Supplier",
      select: "name email contactPerson phoneNumber address -_id",
    });

  if (!reception)
    return res
      .status(404)
      .send("The reception with the given ID was not found.");

  res.send(reception);
});

module.exports = router;
