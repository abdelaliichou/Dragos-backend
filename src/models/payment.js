const Joi = require("joi");
const mongoose = require("mongoose");
Joi.objectId = require("joi-objectid")(Joi);

const paymentSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const Payment = mongoose.model("payment", paymentSchema);

function validatePayment(payment) {
  let template = Joi.object().keys({
    user: Joi.objectId().required(),
    type: Joi.string().required(),
    date: Joi.date().required(),
  });

  return template.validate(payment);
}

module.exports = {
  Payment,
  validatePayment
}
