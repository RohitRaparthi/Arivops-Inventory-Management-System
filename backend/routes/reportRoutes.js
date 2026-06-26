const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getDashboardAnalytics,
  getSalesSummary,
  getExpenseSummary,
  getProfitLossReport,
  getLowStockReport,
  getStockHealthReport,
  getMonthlySalesReport,
  getTopSellingProducts,
  getInvoiceSummary,
} = require("../controllers/reportController");
console.log("Report Routes Loaded");
// ================= Dashboard =================
router.get(
  "/dashboard",
  authMiddleware,
  getDashboardAnalytics
);

// ================= Sales =================
router.get(
  "/sales",
  authMiddleware,
  getSalesSummary
);

router.get(
  "/sales/monthly",
  authMiddleware,
  getMonthlySalesReport
);

router.get(
  "/sales/top-products",
  authMiddleware,
  getTopSellingProducts
);

// ================= Expenses =================
router.get(
  "/expenses",
  authMiddleware,
  getExpenseSummary
);

// ================= Profit & Loss =================
router.get(
  "/profit-loss",
  authMiddleware,
  getProfitLossReport
);

// ================= Inventory =================
router.get(
  "/low-stock",
  authMiddleware,
  getLowStockReport
);

router.get(
  "/stock-health",
  authMiddleware,
  getStockHealthReport
);

// ================= Invoices =================
router.get(
  "/invoices",
  authMiddleware,
  getInvoiceSummary
);

module.exports = router;