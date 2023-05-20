const Joi = require("joi");
const mongoose = require("mongoose");
Joi.objectId = require("joi-objectid")(Joi);

const cartSchema = new mongoose.Schema({
  total: {
    type: Number,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  items: [
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

const Cart = mongoose.model("Cart", cartSchema);

function validateCart(cart) {
  let template = Joi.object().keys({
    user: Joi.objectId().required(),
    total: Joi.number().required(),
    items: Joi.array().items(
      Joi.object({
        product_id: Joi.objectId().required(),
        quantity: Joi.number().default(1),
      })
    ),
  });

  return template.validate(cart);
}

exports.Cart = Cart;
exports.validate = validateCart;
