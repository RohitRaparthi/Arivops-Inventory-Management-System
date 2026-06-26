const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  exportProducts,
} = require("../controllers/productExcelController");

const {
  exportOrders,
} = require("../controllers/orderExcelController");

const {
  exportInvoices,
} = require("../controllers/invoiceExcelController");

const {
  exportExpenses,
} = require("../controllers/expenseExcelController");

// Products
router.get(
  "/products",
  authMiddleware,
  exportProducts
);

// Orders
router.get(
  "/orders",
  authMiddleware,
  exportOrders
);

// Invoices
router.get(
  "/invoices",
  authMiddleware,
  exportInvoices
);

// Expenses
router.get(
  "/expenses",
  authMiddleware,
  exportExpenses
);

module.exports = router;