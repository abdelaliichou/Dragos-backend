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
  brand_id: {
    type: String,
    required: true,
  },
  overview: {
    type: String,
    required: true,
  },
  howToUse: {
    type: String,
    required: true,
  },
  image: {
    type: [String],
    required: true,
  },
  rating: {
    type: String,
    required: true,
  },
  caution: {
    type: String,
    required: true,
  },
  features: {
    type: [String],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  reviews: [
    {
      user: {
        type: String,
        required: true,
      },
      review: {
        type: String,
        required: true,
      },
    },
  ],
});

const Product = mongoose.model("products", productSchema);

function validateProduct(product) {
  let template = Joi.object().keys({
    category_id: Joi.objectId().required(),
    brand_id: Joi.objectId().required(),
    price: Joi.number().required(),
    name: Joi.string().required(),
    overview: Joi.string().required(),
    howToUse: Joi.string().required(),
    rating: Joi.string().required(),
    caution: Joi.string().required(),
    features: Joi.array().items(Joi.string()).required(),
    image: Joi.array().items(Joi.string()).required(),
    discription: Joi.string().required(),
    quantity: Joi.number().required(),
    reviews: Joi.array().items(
      Joi.object({
        user: Joi.objectId().required(),
        review: Joi.string().required(),
      })
    ),
  });

  return template.validate(product);
}

exports.Product = Product;
exports.validate = validateProduct;
