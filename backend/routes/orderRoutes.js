const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

// ==============================
// Get All Orders
// ==============================
router.get("/", authMiddleware, getOrders);

// ==============================
// Get Single Order
// ==============================
router.get("/:id", authMiddleware, getOrder);

// ==============================
// Create Order
// ==============================
router.post("/", authMiddleware, createOrder);

// ==============================
// Update Order
// ==============================
router.put("/:id", authMiddleware, updateOrder);

// ==============================
// Delete Order
// ==============================
router.delete("/:id", authMiddleware, deleteOrder);

module.exports = router;