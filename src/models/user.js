const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");
const JWT = require("jsonwebtoken");
Joi.objectId = require("joi-objectid")(Joi);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  orders: [
    {
      order_id: String,
    },
  ],
  favorites: [
    {
      product_id: String,
    },
  ],
  cart: [
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
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

// creating the generate authentification token function so we call it in the POST

userSchema.methods.generateAuthToken = function () {
  const token = JWT.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  let template = Joi.object().keys({
    name: Joi.string().min(5).required(),
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
    address: Joi.string().required(),
    phone: Joi.number().required(),
    orders: Joi.array().items(
      Joi.object({
        order_id: Joi.objectId().required(),
      })
    ),
    favorites: Joi.array().items(
      Joi.object({
        product_id: Joi.objectId().required(),
      })
    ),
    cart: Joi.array().items(
      Joi.object({
        product_id: Joi.objectId().required(),
        quantity: Joi.number().default(1),
      })
    ),
    isAdmin: Joi.boolean(),
  });

  return template.validate(user);
}

exports.User = User;
exports.validate = validateUser;
