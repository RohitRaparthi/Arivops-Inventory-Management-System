const Product = require("../models/Product");
const Order = require("../models/Order");
const Invoice = require("../models/Invoice");
const Expense = require("../models/Expense");
const Customer = require("../models/Customer");

console.log("Report Controller Loaded");

// =======================================
// Dashboard Analytics
// =======================================
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const [
      totalProducts,
      totalCustomers,
      totalOrders,
      totalInvoices,
      totalExpenses,
      products,
      orders,
      expenses,
    ] = await Promise.all([
      Product.countDocuments(),
      Customer.countDocuments(),
      Order.countDocuments(),
      Invoice.countDocuments(),
      Expense.countDocuments(),
      Product.find(),
      Order.find(),
      Expense.find(),
    ]);

    const totalStock = products.reduce(
      (sum, product) => sum + product.currentStock,
      0
    );

    const inventoryValue = products.reduce(
      (sum, product) => sum + (product.currentStock * product.costPrice),
      0
    );

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.grandTotal,
      0
    );

    const totalExpenseAmount = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const profit = totalRevenue - totalExpenseAmount;

    res.status(200).json({
      totalProducts,
      totalCustomers,
      totalOrders,
      totalInvoices,
      totalExpenses,
      totalStock,
      inventoryValue,
      totalRevenue,
      totalExpenseAmount,
      profit,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================================
// Sales Summary
// =======================================
exports.getSalesSummary = async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    const totalSales = orders.reduce(
      (sum, order) => sum + order.grandTotal,
      0
    );

    const totalGST = orders.reduce(
      (sum, order) => sum + order.gstAmount,
      0
    );

    const totalSubtotal = orders.reduce(
      (sum, order) => sum + order.subtotal,
      0
    );

    const completedOrders = orders.filter(
      (order) => order.orderStatus === "Completed"
    ).length;

    const pendingOrders = orders.filter(
      (order) => order.orderStatus === "Created"
    ).length;

    const cancelledOrders = orders.filter(
      (order) => order.orderStatus === "Cancelled"
    ).length;

    res.status(200).json({
      totalOrders: orders.length,
      completedOrders,
      pendingOrders,
      cancelledOrders,
      totalSubtotal,
      totalGST,
      totalSales,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================================
// Expense Summary
// =======================================
exports.getExpenseSummary = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({
      expenseDate: -1,
    });

    const totalExpense = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const categorySummary = {};

    expenses.forEach((expense) => {
      if (!categorySummary[expense.category]) {
        categorySummary[expense.category] = 0;
      }

      categorySummary[expense.category] += expense.amount;
    });

    res.status(200).json({
      totalExpenses: expenses.length,
      totalExpenseAmount: totalExpense,
      categorySummary,
      recentExpenses: expenses.slice(0, 10),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================================
// Profit & Loss Report
// =======================================
exports.getProfitLossReport = async (req, res) => {
  try {
    const [orders, expenses, products] = await Promise.all([
      Order.find(),
      Expense.find(),
      Product.find(),
    ]);

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.grandTotal,
      0
    );

    const totalExpense = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const totalCOGS = orders.reduce((sum, order) => {
      let orderCost = 0;

      order.items.forEach((item) => {
        const product = products.find(
          (p) => p._id.toString() === item.product.toString()
        );

        if (product) {
          orderCost += product.costPrice * item.quantity;
        }
      });

      return sum + orderCost;
    }, 0);

    const grossProfit = totalRevenue - totalCOGS;
    const netProfit = grossProfit - totalExpense;

    res.status(200).json({
      totalRevenue,
      totalCOGS,
      totalExpense,
      grossProfit,
      netProfit,
      profitMargin:
        totalRevenue > 0
          ? ((netProfit / totalRevenue) * 100).toFixed(2)
          : 0,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================================
// Low Stock Report
// =======================================
exports.getLowStockReport = async (req, res) => {
  try {
    const products = await Product.find().sort({
      currentStock: 1,
    });

    const lowStockProducts = products.filter(
      (product) => product.currentStock <= product.reorderLevel
    );

    res.status(200).json({
      totalLowStockProducts: lowStockProducts.length,
      products: lowStockProducts,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================================
// Stock Health Report
// =======================================
exports.getStockHealthReport = async (req, res) => {
  try {
    const products = await Product.find();

    const green = products.filter(
      (product) => product.stockHealth === "green"
    );

    const amber = products.filter(
      (product) => product.stockHealth === "amber"
    );

    const red = products.filter(
      (product) => product.stockHealth === "red"
    );

    const stockValue = products.reduce(
      (sum, product) =>
        sum + product.currentStock * product.costPrice,
      0
    );

    res.status(200).json({
      totalProducts: products.length,
      stockValue,
      healthyStock: green.length,
      warningStock: amber.length,
      outOfStock: red.length,
      green,
      amber,
      red,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================================
// Monthly Sales Report
// =======================================
exports.getMonthlySalesReport = async (req, res) => {
  try {
    const orders = await Order.find();

    const monthlySales = {};

    orders.forEach((order) => {
      const date = new Date(order.createdAt);

      const month = date.toLocaleString("default", {
        month: "short",
      });

      const year = date.getFullYear();

      const key = `${month} ${year}`;

      if (!monthlySales[key]) {
        monthlySales[key] = {
          orders: 0,
          sales: 0,
          gst: 0,
        };
      }

      monthlySales[key].orders += 1;
      monthlySales[key].sales += order.grandTotal;
      monthlySales[key].gst += order.gstAmount;
    });

    res.status(200).json(monthlySales);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================================
// Top Selling Products
// =======================================
exports.getTopSellingProducts = async (req, res) => {
  try {
    const orders = await Order.find();

    const salesMap = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const id = item.product.toString();

        if (!salesMap[id]) {
          salesMap[id] = {
            productId: id,
            productName: item.productName,
            quantitySold: 0,
            revenue: 0,
          };
        }

        salesMap[id].quantitySold += item.quantity;
        salesMap[id].revenue += item.total;
      });
    });

    const topProducts = Object.values(salesMap)
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, 10);

    res.status(200).json(topProducts);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================================
// Invoice Summary
// =======================================
exports.getInvoiceSummary = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate({
        path: "order",
        populate: {
          path: "customer",
        },
      })
      .sort({
        createdAt: -1,
      });

    const paidInvoices = invoices.filter(
      (invoice) => invoice.paymentStatus === "Paid"
    );

    const pendingInvoices = invoices.filter(
      (invoice) => invoice.paymentStatus === "Pending"
    );

    const partialInvoices = invoices.filter(
      (invoice) => invoice.paymentStatus === "Partially Paid"
    );

    const totalPaid = invoices.reduce(
      (sum, invoice) => sum + invoice.paidAmount,
      0
    );

    const totalDue = invoices.reduce(
      (sum, invoice) => sum + invoice.dueAmount,
      0
    );

    res.status(200).json({
      totalInvoices: invoices.length,
      paidInvoices: paidInvoices.length,
      pendingInvoices: pendingInvoices.length,
      partiallyPaidInvoices: partialInvoices.length,
      totalPaid,
      totalDue,
      recentInvoices: invoices.slice(0, 10),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};