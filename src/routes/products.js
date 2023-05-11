const { validate, Product } = require("../models/product");
const express = require("express");
const router = express.Router();

const { Category } = require("../models/category");

router.get("/all", async (req, res) => {
  const products = await Product.find().sort("name");
  res.send(products);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findById(req.body.category_id);
  if (!category) return res.status(400).send("Invalid category ID !");

  let product = new Product({
    name: req.body.name,
    discription: req.body.discription,
    price: req.body.price,
    image: req.body.image,
    quantity: req.body.quantity,
    category_id: req.body.category_id,
  });

  result = await product.save();

  res.send(result);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findById(req.body.category_id);
  if (!category) return res.status(400).send("Invalid category ID !");

  let product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      discription: req.body.discription,
      price: req.body.price,
      image: req.body.image,
      quantity: req.body.quantity,
      category_id: req.body.category_id,
    },
    {
      new: true,
    }
  );

  if (!product)
    return res.status(404).send("The product with the given ID was not found.");

  res.send(product);
});

router.delete("/:id", async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);

  if (!product)
    return res.status(404).send("The product with the given ID was not found.");

  res.send(product);
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product)
    return res.status(404).send("The product with the given ID was not found.");

  res.send(product);
});

module.exports = router;
