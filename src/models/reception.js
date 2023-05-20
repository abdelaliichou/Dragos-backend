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
  receivedItems: {
    type: [String],
    required: true,
  },
  receivedQuantities: {
    type: [Number],
    required: true,
  },
  receivedTotal: {
    type: Number,
    required: true,
  },
  receivedPrices: {
    type: [Number],
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
    receivedItems: Joi.array().items(Joi.objectId()).required(),
    receivedQuantities: Joi.array().items(Joi.number()).required(),
    receivedPrices: Joi.array().items(Joi.number()).required(),
    receivedTotal: Joi.number().required(),
    receivedValue: Joi.number().required(),
    receivedBy: Joi.string().required(),
    notes: Joi.string().required(),
  });

  return template.validate(reception);
}

exports.Reception = Reception;
exports.validate = validateReception;
