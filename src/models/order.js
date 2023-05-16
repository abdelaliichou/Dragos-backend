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
  delivery_id: {
    type: String,
    required: true,
  },
  payment_id: {
    type: String,
    required: true,
  },
  shipping_id: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
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
    status: Joi.string().required(),
    date: Joi.date().required(),
    total: Joi.number().required(),
    user: Joi.objectId().required(),
    delivery_id: Joi.objectId().required(),
    shipping_id: Joi.objectId().required(),
    payment_id: Joi.objectId().required(),
    products: Joi.array().items(
      Joi.object({
        product_id: Joi.objectId().required(),
        quantity: Joi.number().default(1),
      })
    ),
  });

  return template.validate(order);
}

exports.Order = Order;
exports.validate = validateOrder;
