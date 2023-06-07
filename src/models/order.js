const Joi = require("joi");
const mongoose = require("mongoose");
Joi.objectId = require("joi-objectid")(Joi);

const orderSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  // payment_id: {
  //   type: String,
  //   required: true,
  // },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: "Not delivered",
  },
  notes: {
    type: String,
    required: false,
  },
  products: [
    {
      product_id: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

const Order = mongoose.model("Order", orderSchema);

function validateOrder(order) {
  let template = Joi.object().keys({
    status: Joi.string().default("Not delivered"),
    state: Joi.string().required(),
    notes: Joi.string(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    address: Joi.string().required(),
    zip: Joi.string().required(),
    date: Joi.date().required(),
    total: Joi.number().required(),
    user: Joi.objectId().required(),
    // payment_id: Joi.objectId().required(),
    products: Joi.array().items(
      Joi.object({
        product_id: Joi.objectId().required(),
        quantity: Joi.number().default(1),
      })
    ),
  });

  return template.validate(order);
}

module.exports = {
  Order,
  validateOrder,
};
