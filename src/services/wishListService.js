const { Product } = require("../models/product");

const addToWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;

    // Check if the product exists
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Add the product ID to the user's wishlist if it doesn't already exist
    if (!req.user.wishlist.includes(product_id)) {
      req.user.wishlist.push(product_id);
      await req.user.save();
    }

    res.json({ message: "Product added to wishlist" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getWishList = async(req, res) => {
  
  try {
    const wishList = await req.user.wishlist 
    // If the cart is empty, return an empty response
    if (!wishList) {
      return res.json({ message: "wishlist is empty" });
    }
    
    // Prepare an array to store the cart items
    const wishListItems = [];
    // Loop through the cart and retrieve product details for each item
    for (const item of wishList) {
      // const product = await product.findById(item._id);
      const product =  await Product.findById(item);
      if (item) {
        const wishListItem = {
          product : product,
        };
        wishListItems.push(wishListItem);
      }
    }
    // Return the items
    res.json({ wishList : wishListItems});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const removeFromWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;

    // Check if the product exists
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Remove the product ID from the user's wishlist if it exists
    const index = req.user.wishlist.indexOf(product_id);
    if (index !== -1) {
      req.user.wishlist.splice(index, 1);
      await req.user.save();
    }

    res.json({ message: "Product removed from wishlist" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { addToWishlist, removeFromWishlist, getWishList };
