const { validate , Product } = require("../models/product");

const express = require("express");
const router = express.Router();
const authService =require("../services/AuthService");

const { Category } = require("../models/category");
const { Brand } = require("../models/brand");


// add rating

router.post("/rating/add",authService.protect, async (req, res) => {
  const product_id = req.body.product_id;
  const review = req.body.review;
  let rating = req.body.rating;

  const product = await Product.findById(product_id);
  if (!product) return res.status(400).send("Invalid product ID !");

  if (!review) return res.status(400).send("please insert a Review !");

  if (!rating) rating = 0;

  // user should be from the jwt

  product.reviews.push({
    user: "64692779fcf6708c6ca5741c",
    review: review,
    rating: rating,
  });

  result = await product.save();

  res.send(result);
});
router.get("/all",authService.protect ,async (req, res) => {
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

// GET /products/filter/price?max=<product_price>&min=<product_price>
router.get("/filter/price",authService.protect, async (req, res) => {
  let maxprice = req.query.max;
  let minprice = req.query.min;

  if (maxprice.length === 0 || minprice.length === 0)
    return res.status(404).send("Please enter the price !");

  maxprice = Number(maxprice);
  minprice = Number(minprice);

  try {
    // Find products matching the price
    const products = await Product.find({
      price: { $gte: minprice, $lte: maxprice },
    })
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
  } catch (error) {
    console.error("Error filtering products by category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /products/filter/brand?id=<brand_id>
router.get("/filter/brand",authService.protect, async (req, res) => {
  const brandID = req.query.id;

  if (brandID.length === 0)
    return res.status(404).send("Please enter the id !");

  const brand = await Brand.findById(brandID);

  if (!brand) return res.status(404).send("Brand not found !");

  try {
    // Find products matching the brand
    const products = await Product.find({ brand_id: brandID })
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
  } catch (error) {
    console.error("Error filtering products by category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /products/filter/category?id=<category_id>
router.get("/filter/category",authService.protect, async (req, res) => {
  const categoryID = req.query.id;

  if (categoryID.length === 0)
    return res.status(404).send("Please enter the id !");

  const category = await Category.findById(categoryID);

  if (!category) return res.status(404).send("Category not found !");

  try {
    // Find products matching the category
    const products = await Product.find({ category_id: categoryID })
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
  } catch (error) {
    console.error("Error filtering products by category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /products/search?name=<product_name>
router.get("/search",authService.protect, async (req, res) => {
  const productName = req.query.name;

  if (productName.length === 0)
    return res.status(404).send("Please enter a name !");
  const regex = new RegExp(productName, "i"); // Use RegExp with "i" option for case-insensitive search

  try {
    // Find products matching the category
    const products = await Product.find({ name: { $regex: regex } })
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
  } catch (error) {
    console.error("Error filtering products by category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// get average rating
router.get("/averageRating/:id",authService.protect, async (req, res) => {
  const productID = req.params.id;

  if (!productID) return res.status(404).send("Please insert the id !");

  const product = await Product.findById(productID);

  if (!product) return res.status(404).send("Product not found !");

  // Calculate the average rating
  let sumOfRatings = 0;
  let numberOfReviews = 0;

  for (const review of product.reviews) {
    if (review.rating >= 0 && review.rating <= 5) {
      sumOfRatings += review.rating;
      numberOfReviews++;
    }
  }

  const averageRating =
    numberOfReviews > 0 ? sumOfRatings / numberOfReviews : 0;

  res.send(averageRating + "");
});



router.post("/",[authService.protect,authService.allowedTo("Admin","manager")], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findById(req.body.category_id);
  if (!category) return res.status(400).send("Invalid category ID !");

  const brand = await Brand.findById(req.body.brand_id);
  if (!brand) return res.status(400).send("Invalid brand ID !");

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

router.put("/:id",[authService.protect,authService.allowedTo("Admin","manager")], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findById(req.body.category_id);
  if (!category) return res.status(400).send("Invalid category ID !");

  const brand = await Brand.findById(req.body.category_id);
  if (!brand) return res.status(400).send("Invalid brand ID !");

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

router.delete("/:id", [authService.protect,authService.allowedTo("Admin","manager")],async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);

  if (!product)
    return res.status(404).send("The product with the given ID was not found.");

  res.send(product);
});

router.get("/:id", authService.protect,async (req, res) => {
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
