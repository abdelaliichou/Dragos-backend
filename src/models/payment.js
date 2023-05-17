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

<<<<<<< HEAD
const Payment = mongoose.model("payment", paymentSchema);
=======
const Payment = mongoose.model("Payment", paymentSchema);
>>>>>>> sakh-branch

function validatePayment(payment) {
  let template = Joi.object().keys({
    user: Joi.objectId().required(),
    type: Joi.string().required(),
  });

  return template.validate(payment);
}

exports.Payment = Payment;
exports.validate = validatePayment;
