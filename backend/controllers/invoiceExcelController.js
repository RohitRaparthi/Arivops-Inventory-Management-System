const ExcelJS = require("exceljs");
const Invoice = require("../models/Invoice");

// ===========================================
// Export Invoices to Excel
// ===========================================
exports.exportInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate({
        path: "order",
        populate: {
          path: "customer",
        },
      })
      .sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "ArviOps";
    workbook.company = "ArviOps Inventory Management";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Invoices");

    worksheet.columns = [
      { header: "Invoice No", key: "invoiceNumber", width: 20 },
      { header: "Order No", key: "orderNumber", width: 18 },
      { header: "Customer", key: "customer", width: 30 },
      { header: "Contact", key: "contact", width: 18 },
      { header: "Invoice Date", key: "invoiceDate", width: 18 },
      { header: "Grand Total", key: "grandTotal", width: 18 },
      { header: "Paid Amount", key: "paidAmount", width: 18 },
      { header: "Due Amount", key: "dueAmount", width: 18 },
      { header: "Payment Status", key: "paymentStatus", width: 18 },
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
      horizontal: "center",
      vertical: "middle",
    };

    invoices.forEach((invoice) => {
      worksheet.addRow({
        invoiceNumber: invoice.invoiceNumber,
        orderNumber: invoice.order?.orderNumber || "",
        customer: invoice.order?.customer?.customerName || "",
        contact: invoice.order?.customer?.contactNumber || "",
        invoiceDate: new Date(invoice.invoiceDate).toLocaleDateString(),
        grandTotal: invoice.order?.grandTotal || 0,
        paidAmount: invoice.paidAmount,
        dueAmount: invoice.dueAmount,
        paymentStatus: invoice.paymentStatus,
      });
    });

    // Currency columns
    ["F", "G", "H"].forEach((column) => {
      worksheet.getColumn(column).numFmt = "₹#,##0.00";
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
      'attachment; filename="invoices.xlsx"'
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