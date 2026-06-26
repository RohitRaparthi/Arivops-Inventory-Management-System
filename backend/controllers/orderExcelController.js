const ExcelJS = require("exceljs");
const Order = require("../models/Order");

// ===========================================
// Export Orders to Excel
// ===========================================
exports.exportOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer")
      .populate("items.product")
      .sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "ArviOps";
    workbook.company = "ArviOps Inventory Management";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Orders");

    worksheet.columns = [
      { header: "Order No", key: "orderNumber", width: 18 },
      { header: "Customer", key: "customer", width: 28 },
      { header: "Contact", key: "contact", width: 18 },
      { header: "Items", key: "items", width: 10 },
      { header: "Subtotal", key: "subtotal", width: 15 },
      { header: "GST %", key: "gstPercentage", width: 10 },
      { header: "GST Amount", key: "gstAmount", width: 15 },
      { header: "Grand Total", key: "grandTotal", width: 18 },
      { header: "Payment Status", key: "paymentStatus", width: 18 },
      { header: "Order Status", key: "orderStatus", width: 18 },
      { header: "Created Date", key: "createdAt", width: 18 },
    ];

    // Header Style
    const header = worksheet.getRow(1);

    header.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
    };

    header.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "2563EB",
      },
    };

    header.alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    // Data
    orders.forEach((order) => {
      worksheet.addRow({
        orderNumber: order.orderNumber,
        customer: order.customer?.customerName || "",
        contact: order.customer?.contactNumber || "",
        items: order.items.length,
        subtotal: order.subtotal,
        gstPercentage: order.gstPercentage,
        gstAmount: order.gstAmount,
        grandTotal: order.grandTotal,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        createdAt: new Date(order.createdAt).toLocaleDateString(),
      });
    });

    // Borders
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Currency formatting
    ["E", "G", "H"].forEach((column) => {
      worksheet.getColumn(column).numFmt = "₹#,##0.00";
    });

    // Freeze Header
    worksheet.views = [
      {
        state: "frozen",
        ySplit: 1,
      },
    ];

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="orders.xlsx"'
    );

    await workbook.xlsx.write(res);

    res.end();

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};