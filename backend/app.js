const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middleware/authMiddleware");
const invoiceRoutes = require("./routes/invoiceRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const pdfRoutes = require("./routes/pdfRoutes");
const excelRoutes = require("./routes/excelRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', status: 'OK' });
});

// Auth routes (public)
app.use("/api/auth", require("./routes/auth"));

// Protected API routes
app.use("/api", authMiddleware, require("./routes/api"));

app.use(
  "/api/customers",
  authMiddleware,
  require("./routes/customerRoutes")
);

app.use(
  "/api/orders",
  authMiddleware,
  require("./routes/orderRoutes")
);

app.use("/api/invoices", invoiceRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/invoices", pdfRoutes);
app.use("/api/export", excelRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reports", reportRoutes);

module.exports = app;