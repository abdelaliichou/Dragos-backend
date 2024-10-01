const Joi = require("joi");
const mongoose = require("mongoose");
Joi.objectId = require("joi-objectid")(Joi);

// importing the product schema to use it in the Effected list products
// const { productSchema } = require("./product");

const promotionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  Effected_products: [
    {
      product_id: {
        type: String,
        required: true,
      },
    },
  ],
});

const Promotion = mongoose.model("promotion", promotionSchema);

function validatePromotion(promotion) {
  let template = Joi.object().keys({
    name: Joi.string().required(),
    start_date: Joi.date().required(),
    end_date: Joi.date().required(),
    discount: Joi.number().required(),
    Effected_products: Joi.array().items(
      Joi.object({
        product_id: Joi.objectId().required(),
      })
    ),
  });

  return template.validate(promotion);
}

module.exports = {
  Promotion,
  validatePromotion
}