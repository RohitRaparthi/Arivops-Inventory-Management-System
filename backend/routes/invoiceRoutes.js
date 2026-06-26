const express = require("express");
const router = express.Router();

const {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} = require("../controllers/invoiceController");

const authMiddleware = require("../middleware/authMiddleware");

// Get all invoices
router.get("/", authMiddleware, getInvoices);

// Get single invoice
router.get("/:id", authMiddleware, getInvoice);

// Create invoice
router.post("/", authMiddleware, createInvoice);

// Update invoice
router.put("/:id", authMiddleware, updateInvoice);

// Delete invoice
router.delete("/:id", authMiddleware, deleteInvoice);

module.exports = router;