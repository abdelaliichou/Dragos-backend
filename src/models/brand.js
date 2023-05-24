const Joi = require("joi");
const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
});

const Brand = mongoose.model("Brand", brandSchema);

function validateBrand(brand) {
  let template = Joi.object().keys({
    name: Joi.string().required(),
    logo: Joi.string().required(),
  });

  return template.validate(brand);
}

module.exports = {
  validateBrand,
  Brand
}
