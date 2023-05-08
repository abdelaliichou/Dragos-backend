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
});

const Payment = mongoose.model("Payment", paymentSchema);

function validatePayment(payment) {
  let template = Joi.object().keys({
    user: Joi.objectId().required(),
    type: Joi.string().required(),
  });

  return template.validate(payment);
}

exports.Payment = Payment;
exports.validate = validatePayment;
