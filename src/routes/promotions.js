const { validate, Promotion } = require("../models/promotion");
const express = require("express");
const router = express.Router();

const { Product } = require("../models/product");

router.get("/all", async (req, res) => {
  const promotion = await Promotion.find().sort("name");
  res.send(promotion);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if all Effected_products are valid product IDs
  const productIds = req.body.Effected_products;
  const invalidProductIds = [];

  for (let i = 0; i < productIds.length; i++) {
    const product = await Product.findById(productIds[i]);
    if (!product) invalidProductIds.push(productIds[i]);
  }

  if (invalidProductIds.length > 0) {
    return res
      .status(400)
      .send(`Invalid product IDs: ${invalidProductIds.join(", ")}`);
  }

  let promotion = new Promotion({
    name: req.body.name,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    discount: req.body.discount,
    Effected_products: req.body.Effected_products,
  });

  result = await promotion.save();

  res.send(result);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if all Effected_products are valid product IDs
  const productIds = req.body.Effected_products;
  const invalidProductIds = [];

  for (let i = 0; i < productIds.length; i++) {
    const product = await Product.findById(productIds[i]);
    if (!product) invalidProductIds.push(productIds[i]);
  }

  if (invalidProductIds.length > 0) {
    return res
      .status(400)
      .send(`Invalid product IDs: ${invalidProductIds.join(", ")}`);
  }

  let promotion = await Promotion.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      discount: req.body.discount,
      Effected_products: req.body.Effected_products,
    },
    {
      new: true,
    }
  );

  if (!promotion)
    return res
      .status(404)
      .send("The promotion with the given ID was not found.");

  res.send(promotion);
});

router.delete("/:id", async (req, res) => {
  const promotion = await Promotion.findByIdAndRemove(req.params.id);

  if (!promotion)
    return res
      .status(404)
      .send("The promotion with the given ID was not found.");

  res.send(promotion);
});

router.get("/:id", async (req, res) => {
  const promotion = await Promotion.findById(req.params.id);

  if (!promotion)
    return res
      .status(404)
      .send("The promotion with the given ID was not found.");

  res.send(promotion);
});

module.exports = router;
