
const {Product} = require("../models/product");

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
  
module.exports ={ addToWishlist,removeFromWishlist};

