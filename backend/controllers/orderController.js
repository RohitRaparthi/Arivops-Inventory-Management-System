const Order = require("../models/Order");
const Product = require("../models/Product");
const Customer = require("../models/Customer");

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { customer, items } = req.body;

    if (!customer || !items || items.length === 0) {
      return res.status(400).json({
        message: "Customer and items are required",
      });
    }

    // Verify customer
    const customerExists = await Customer.findById(customer);

    if (!customerExists) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    let subtotal = 0;

    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message: `Product not found`,
        });
      }

      if (product.currentStock < item.quantity) {
        return res.status(400).json({
          message: `${product.productName} has insufficient stock`,
        });
      }

      const total = product.sellingPrice * item.quantity;

      subtotal += total;

      orderItems.push({
        product: product._id,
        productName: product.productName,
        quantity: item.quantity,
        sellingPrice: product.sellingPrice,
        total,
      });

      // Reduce stock
      product.currentStock -= item.quantity;

      // Update stock health
      if (product.currentStock === 0) {
        product.stockHealth = "red";
      } else if (product.currentStock <= product.reorderLevel) {
        product.stockHealth = "amber";
      } else {
        product.stockHealth = "green";
      }

      await product.save();
    }

    const gstPercentage = 18;

    const gstAmount = subtotal * gstPercentage / 100;

    const grandTotal = subtotal + gstAmount;

    const count = await Order.countDocuments();

    const orderNumber =
      "ORD" + String(count + 1).padStart(5, "0");

    const order = await Order.create({
      orderNumber,
      customer,
      items: orderItems,
      subtotal,
      gstPercentage,
      gstAmount,
      grandTotal,
    });

    res.status(201).json(order);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message,
    });

  }
};

// Update order
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {

    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      message: "Order deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};