const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  downloadInvoicePDF,
} = require("../controllers/pdfController");

router.get(
  "/:id/pdf",
  authMiddleware,
  downloadInvoicePDF
);

module.exports = router;