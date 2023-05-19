const { validate, Product } = require("../models/product");
const express = require("express");
const router = express.Router();

const { Category } = require("../models/category");

router.get("/all", async (req, res) => {
  const products = await Product.find()
    .sort("name")
    .populate({
      path: "category_id",
      model: "Category",
      select: "name image -_id",
    })
    .populate({
      path: "brand_id",
      model: "Brand",
      select: "name logo -_id",
    })
    .populate({
      path: "reviews.user",
      model: "User",
      select: "name profileImg -_id",
    });

  res.send(products);
});

router.get("/search/:product", async (req, res) => {
  const productName = req.params.product;
  const regex = new RegExp(productName, "i"); // Use RegExp with "i" option for case-insensitive search
  const result_list = await Product.find({ name: { $regex: regex } });

  if (!result_list || result_list.length === 0) {
    return res.status(400).send("No product found !");
  }

  res.send(result_list);

  // const productName = req.params.product;
  // const result_list = await Product.find({ name: productName });

  // if (!result_list) return res.status(400).send("No product found !");

  // res.send(result_list);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findById(req.body.category_id);
  if (!category) return res.status(400).send("Invalid category ID !");

  let product = new Product({
    name: req.body.name,
    brand_id: req.body.brand_id,
    overview: req.body.overview,
    howToUse: req.body.howToUse,
    rating: req.body.rating,
    caution: req.body.caution,
    features: req.body.features,
    reviews: req.body.reviews,
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
      brand_id: req.body.brand_id,
      overview: req.body.overview,
      howToUse: req.body.howToUse,
      rating: req.body.rating,
      caution: req.body.caution,
      features: req.body.features,
      reviews: req.body.reviews,
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
  const product = await Product.findById(req.params.id)
    .populate({
      path: "category_id",
      model: "Category",
      select: "name image -_id",
    })
    .populate({
      path: "brand_id",
      model: "Brand",
      select: "name logo -_id",
    })
    .populate({
      path: "reviews.user",
      model: "User",
      select: "name profileImg -_id",
    });

  if (!product)
    return res.status(404).send("The product with the given ID was not found.");

  res.send(product);
});

module.exports = router;
