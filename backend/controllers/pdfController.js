const PDFDocument = require("pdfkit");
const Invoice = require("../models/Invoice");

// =========================================
// Download Invoice PDF
// =========================================
exports.downloadInvoicePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate({
      path: "order",
      populate: [
        {
          path: "customer",
        },
        {
          path: "items.product",
        },
      ],
    });

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    const order = invoice.order;
    const customer = order.customer;

    const doc = new PDFDocument({
      size: "A4",
      margin: 40,
    });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${invoice.invoiceNumber}.pdf`
    );

    doc.pipe(res);

    // =========================================
    // Company Header
    // =========================================
    doc
      .fontSize(24)
      .fillColor("#2563eb")
      .text("ArviOps Inventory Management", {
        align: "center",
      });

    doc.moveDown(0.3);

    doc
      .fontSize(12)
      .fillColor("black")
      .text("Invoice", {
        align: "center",
      });

    doc.moveDown(2);

    // =========================================
    // Invoice Information
    // =========================================
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(`Invoice Number : ${invoice.invoiceNumber}`);

    doc
      .font("Helvetica")
      .text(
        `Invoice Date : ${new Date(
          invoice.invoiceDate
        ).toLocaleDateString()}`
      );

    doc.text(`Order Number : ${order.orderNumber}`);

    doc.text(
      `Payment Status : ${invoice.paymentStatus}`
    );

    doc.moveDown();

    // =========================================
    // Customer Details
    // =========================================
    doc
      .font("Helvetica-Bold")
      .text("Bill To");

    doc.font("Helvetica");

    doc.text(customer.customerName);

    doc.text(customer.contactNumber);

    if (customer.email) {
      doc.text(customer.email);
    }

    if (customer.address) {
      doc.text(customer.address);
    }

    doc.moveDown(2);

    // =========================================
    // Items Header
    // =========================================
    const startY = doc.y;

    doc
      .font("Helvetica-Bold")
      .fontSize(11);

    doc.text("Product", 40, startY);

    doc.text("Qty", 260, startY);

    doc.text("Price", 330, startY);

    doc.text("Total", 430, startY);

    doc.moveTo(40, startY + 18)
      .lineTo(550, startY + 18)
      .stroke();

    let currentY = startY + 30;

    // =========================================
    // Products
    // =========================================
    order.items.forEach((item) => {
      doc
        .font("Helvetica")
        .fontSize(10);

      doc.text(
        item.productName,
        40,
        currentY,
        {
          width: 200,
        }
      );

      doc.text(
        item.quantity.toString(),
        270,
        currentY
      );

      doc.text(
        `₹${item.sellingPrice.toFixed(2)}`,
        320,
        currentY
      );

      doc.text(
        `₹${item.total.toFixed(2)}`,
        430,
        currentY
      );

      currentY += 25;
    });

    doc.moveDown(2);
        // =========================================
    // Totals Section
    // =========================================
    currentY += 20;

    doc
      .moveTo(300, currentY)
      .lineTo(550, currentY)
      .stroke();

    currentY += 15;

    doc
      .font("Helvetica")
      .fontSize(11);

    doc.text(
      "Subtotal",
      330,
      currentY
    );

    doc.text(
      `₹${order.subtotal.toFixed(2)}`,
      460,
      currentY,
      {
        width: 80,
        align: "right",
      }
    );

    currentY += 20;

    doc.text(
      `GST (${order.gstPercentage}%)`,
      330,
      currentY
    );

    doc.text(
      `₹${order.gstAmount.toFixed(2)}`,
      460,
      currentY,
      {
        width: 80,
        align: "right",
      }
    );

    currentY += 20;

    doc
      .font("Helvetica-Bold");

    doc.text(
      "Grand Total",
      330,
      currentY
    );

    doc.text(
      `₹${order.grandTotal.toFixed(2)}`,
      460,
      currentY,
      {
        width: 80,
        align: "right",
      }
    );

    currentY += 30;

    // =========================================
    // Payment Details
    // =========================================
    doc
      .font("Helvetica");

    doc.text(
      "Paid Amount",
      330,
      currentY
    );

    doc.text(
      `₹${invoice.paidAmount.toFixed(2)}`,
      460,
      currentY,
      {
        width: 80,
        align: "right",
      }
    );

    currentY += 20;

    doc.text(
      "Due Amount",
      330,
      currentY
    );

    doc.text(
      `₹${invoice.dueAmount.toFixed(2)}`,
      460,
      currentY,
      {
        width: 80,
        align: "right",
      }
    );

    currentY += 20;

    doc
      .font("Helvetica-Bold");

    doc.text(
      "Payment Status",
      330,
      currentY
    );

    doc.text(
      invoice.paymentStatus,
      460,
      currentY,
      {
        width: 80,
        align: "right",
      }
    );

    // =========================================
    // Footer
    // =========================================
    doc.moveDown(4);

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("gray")
      .text(
        "Thank you for doing business with us!",
        {
          align: "center",
        }
      );

    doc.moveDown(0.5);

    doc.text(
      "Generated by ArviOps Inventory Management System",
      {
        align: "center",
      }
    );

    // Finish PDF
    doc.end();

  } catch (error) {
    console.error(error);

    if (!res.headersSent) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
};