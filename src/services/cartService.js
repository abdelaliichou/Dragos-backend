const express = require('express');
const user = require("../models/userModel");
const Product = require("../models/product");

const validateProductId = async (product_id) => {
  try {
    const product = await Product.findById(product_id);
    if (product) {
      return true; // Product exists in the database
    }
    return false; // Product does not exist in the database
  } catch (error) {
    console.error(error);
    throw new Error("Error validating product");
  }
};

const updateCart = async (req, res) => {
  const { product_id, quantity } = req.body;
  if (quantity === '0') {
    // Remove the product from cart if quantity is 0
    const existingProductIndex = req.user.cart.findIndex((item) => item.product_id.toString() === product_id);
    
    if (existingProductIndex !== -1) {
      req.user.cart.splice(existingProductIndex, 1);
      req.user.save();
    }
    
    return res.json({ message: "Product removed from cart" });
  }
  const existingProductIndex = req.user.cart.findIndex(
    (item) => item.product_id.toString() === product_id
  );

  try {
    const isValid = await validateProductId(product_id);

    if (!isValid) {
      // Product not found, return an error response
      return res.status(404).json({ error: "Product not found" });
    }

    if (existingProductIndex !== -1) {
      // Product already exists in cart, update quantity or remove if quantity is 0
      if (quantity === 0) {
        // Remove the product from cart
        req.user.cart.splice(existingProductIndex, 1);
      } else {
        req.user.cart[existingProductIndex].quantity = quantity;
      }
    } else {
      req.user.cart.push({ product_id, quantity });
    }

    await req.user.save();
    res.json({ message: "Cart updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const displayCart = async (req, res) => {
  try {
    // Retrieve the user's cart
    const cart = req.user.cart;
    
    // If the cart is empty, return an empty response
    if (cart.length === 0) {
      return res.json({ message: "Cart is empty" });
    }
    
    // Prepare an array to store the cart items
    const cartItems = [];
    let totalPrice = 0;
    // Loop through the cart and retrieve product details for each item
    for (const item of cart) {
      const product = await Product.findById(item.product_id);
      
      if (product) {
        const cartItem = {
          product_id: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
        };
        
        cartItems.push(cartItem);
         // Calculate the subtotal price for the item and add it to the total price
         const subtotal = product.price * item.quantity;
        totalPrice += subtotal;
      }
    }
    
    // Return the cart items
    res.json({ cart: cartItems , totalPrice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};









module.exports = {
  updateCart,
  displayCart
};
