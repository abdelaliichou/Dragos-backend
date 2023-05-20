const Joi = require("joi");
const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contactPerson: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
});

const Supplier = mongoose.model("Supplier", supplierSchema);

function validateSupplier(supplier) {
  let template = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    contactPerson: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    address: Joi.string().required(),
    isActive: Joi.boolean().required(),
  });

  return template.validate(supplier);
}

exports.Supplier = Supplier;
exports.validate = validateSupplier;
