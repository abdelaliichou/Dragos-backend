const Joi = require("joi");
const mongoose = require("mongoose");
Joi.objectId = require("joi-objectid")(Joi);

const cartSchema = new mongoose.Schema({
  items: {
    type: [String],
    required: true,
  },
  quantities: {
    type: [Number],
    required: true,
  },
  total: {
    type: [Number],
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
});

const Cart = mongoose.model("Cart", cartSchema);

function validateCart(cart) {
  let template = Joi.object().keys({
    user: Joi.objectId().required(),
    total: Joi.array().items(Joi.number()).required(),
    quantities: Joi.array().items(Joi.number()).required(),
    items: Joi.array().items(Joi.string()).required(),
  });

  return template.validate(cart);
}

exports.Cart = Cart;
exports.validate = validateCart;
