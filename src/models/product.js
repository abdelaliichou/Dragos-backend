const Joi = require("joi");
const mongoose = require("mongoose");
Joi.objectId = require("joi-objectid")(Joi);

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  discription: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category_id: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

<<<<<<< HEAD
const Product = mongoose.model("products", productSchema);
=======
const Product = mongoose.model("Product", productSchema);
>>>>>>> sakh-branch

function validateProduct(product) {
  let template = Joi.object().keys({
    category_id: Joi.objectId().required(),
    price: Joi.number().required(),
    name: Joi.string().required(),
    discription: Joi.string().required(),
    image: Joi.string().required(),
    quantity: Joi.number().required(),
  });

  return template.validate(product);
}

exports.Product = Product;
exports.validate = validateProduct;
