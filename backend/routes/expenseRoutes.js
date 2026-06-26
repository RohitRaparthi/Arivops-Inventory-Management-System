const express = require("express");
const router = express.Router();

const {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

const authMiddleware = require("../middleware/authMiddleware");

// Get all expenses
router.get("/", authMiddleware, getExpenses);

// Get single expense
router.get("/:id", authMiddleware, getExpense);

// Create expense
router.post("/", authMiddleware, createExpense);

// Update expense
router.put("/:id", authMiddleware, updateExpense);

// Delete expense
router.delete("/:id", authMiddleware, deleteExpense);

module.exports = router;