const Joi = require("joi");
const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
});

const Shipping = mongoose.model("Shipping", shippingSchema);

function validateShipping(shipping) {
  let template = Joi.object().keys({
    name: Joi.string().required(),
    price: Joi.string().required(),
  });

  return template.validate(shipping);
}

exports.Shipping = Shipping;
exports.validate = validateShipping;
