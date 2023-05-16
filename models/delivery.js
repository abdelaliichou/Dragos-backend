const Joi = require("joi");
const mongoose = require("mongoose");
Joi.objectId = require("joi-objectid")(Joi);

// importing the product schema to use it in the Effected list products
// const { productSchema } = require("./product");

const deliverySchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

const Delivery = mongoose.model("Delivery", deliverySchema);

function validateDelivery(delivery) {
  let template = Joi.object().keys({
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip: Joi.string().required(),
    country: Joi.string().required(),
    phone: Joi.string().required(),
    date: Joi.date().required(),
    user: Joi.objectId().required(),
  });

  return template.validate(delivery);
}

exports.Delivery = Delivery;
exports.validate = validateDelivery;
