const express = require('express');
const user = require("../models/userModel");
const Product = require("../models/product");

const validateProductId =  async (productId, res) => {
  // Find the product with the given product_id in the database
 const product = await Product.findById(productId, (err, product) => {
    if (err) {
      // Handle any errors that occurred during the database query
      return res.json({"status" : "Error connecting to server"})
    }
    
    if (!product) {
      // No product found with the given product_id
      return res.json({"status" : "no product found with thid id"})
    }
    
    // Product found in the database
    return console.log("product is valid");
  });
};

const updateCart = async (req, res) => 
{
  const { product_id, quantity } = req.body;
  const existingProductIndex =  await req.user.cart.findIndex((item) => item.product_id.toString() === product_id);
    // Validate the product_id
  validateProductId(product_id, (err, isValid) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    
    if (!isValid) {
      // Product not found, return an error response
      return res.status(404).json({ error: "Product not found" });
    }
})
if (existingProductIndex !== -1) {
  // Product already exists in cart, update quantity or remove if quantity is 0
  if (quantity === 0) {
    // Remove the product from cart
     await req.user.cart.splice(existingProductIndex, 1);
  } else{
    await req.user.cart[existingProductIndex].push({ product_id, quantity });
    req.user.save();
  }
  }
    else{
      await req.user.cart.push({ product_id, quantity });
      req.user.save();
    }
    
    res.json({ message: "Cart updated" });
};
  module.exports = {
    updateCart
  }