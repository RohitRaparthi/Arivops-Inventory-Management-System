const Product = require("../models/Product");

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add product
exports.createProduct = async (req, res) => {
  try {
    const data = req.body;

    if (data.currentStock === 0) {
      data.stockHealth = "red";
    } else if (data.currentStock <= data.reorderLevel) {
      data.stockHealth = "amber";
    } else {
      data.stockHealth = "green";
    }

    const product = await Product.create(data);

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Merge old values with new values
    const updatedProduct = {
      ...product.toObject(),
      ...req.body,
    };
    console.log(updatedProduct.currentStock)
    // Calculate stock health
    if (updatedProduct.currentStock === 0) {
      updatedProduct.stockHealth = "red";
    } else if (
      updatedProduct.currentStock <= updatedProduct.reorderLevel
    ) {
      updatedProduct.stockHealth = "amber";
    } else {
      updatedProduct.stockHealth = "green";
    }

    const result = await Product.findByIdAndUpdate(
      req.params.id,
      updatedProduct,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};