const Joi = require("joi");
const mongoose = require("mongoose");
Joi.objectId = require("joi-objectid")(Joi);

const receptionSchema = new mongoose.Schema({
  arrivalDate: {
    type: Date,
    required: true,
  },
  supplier_id: {
    type: String,
    required: true,
  },
  products: [
    {
      receivedItem: {
        type: String,
        required: true,
      },
      receivedQuantity: {
        type: Number,
        default: 1,
      },
      receivedPrice: {
        type: Number,
        required: true,
      },
    },
  ],
  receivedTotal: {
    type: Number,
    required: true,
  },
  receivedValue: {
    type: Number,
    required: true,
  },
  receivedBy: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    required: true,
  },
});

const Reception = mongoose.model("Reception", receptionSchema);

function validateReception(reception) {
  let template = Joi.object().keys({
    arrivalDate: Joi.date().required(),
    supplier_id: Joi.objectId().required(),
    products: Joi.array().items(
      Joi.object({
        receivedItem: Joi.objectId().required(),
        receivedQuantity: Joi.number().default(1),
        receivedPrice: Joi.number().required(),
      })
    ),
    receivedTotal: Joi.number().required(),
    receivedValue: Joi.number().required(),
    receivedBy: Joi.string().required(),
    notes: Joi.string().required(),
  });

  return template.validate(reception);
}

exports.Reception = Reception;
exports.validate = validateReception;
