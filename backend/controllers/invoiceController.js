const Invoice = require("../models/Invoice");
const Order = require("../models/Order");

// Generate Invoice Number
const generateInvoiceNumber = async () => {
  const count = await Invoice.countDocuments();
  return "INV" + String(count + 1).padStart(5, "0");
};

// ============================
// Get All Invoices
// ============================
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate({
        path: "order",
        populate: [
          {
            path: "customer",
          },
          {
            path: "items.product",
          },
        ],
      })
      .sort({ createdAt: -1 });

    res.status(200).json(invoices);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ============================
// Get Single Invoice
// ============================
exports.getInvoice = async (req, res) => {
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

    res.status(200).json(invoice);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ============================
// Create Invoice
// ============================
exports.createInvoice = async (req, res) => {
  try {
    const { order: orderId, paidAmount = 0 } = req.body;

    if (!orderId) {
      return res.status(400).json({
        message: "Order is required",
      });
    }

    const order = await Order.findById(orderId)
      .populate("customer")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const existingInvoice = await Invoice.findOne({
      order: orderId,
    });

    if (existingInvoice) {
      return res.status(400).json({
        message: "Invoice already exists for this order",
      });
    }

    const invoiceNumber = await generateInvoiceNumber();

    let dueAmount = order.grandTotal - Number(paidAmount);

    if (dueAmount < 0) {
      dueAmount = 0;
    }

    let paymentStatus = "Pending";

    if (paidAmount === 0) {
      paymentStatus = "Pending";
    } else if (paidAmount >= order.grandTotal) {
      paymentStatus = "Paid";
      dueAmount = 0;
    } else {
      paymentStatus = "Partially Paid";
    }

    const invoice = await Invoice.create({
      invoiceNumber,
      order: order._id,
      paidAmount,
      dueAmount,
      paymentStatus,
    });

    order.paymentStatus = paymentStatus;
    await order.save();

    const populatedInvoice = await Invoice.findById(invoice._id).populate({
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

    res.status(201).json({
      message: "Invoice created successfully",
      invoice: populatedInvoice,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ============================
// Update Invoice
// ============================
exports.updateInvoice = async (req, res) => {
  try {
    const { paidAmount } = req.body;

    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    const order = await Order.findById(invoice.order);

    if (!order) {
      return res.status(404).json({
        message: "Associated order not found",
      });
    }

    if (paidAmount !== undefined) {
      invoice.paidAmount = Number(paidAmount);

      let dueAmount = order.grandTotal - invoice.paidAmount;

      if (dueAmount < 0) {
        dueAmount = 0;
      }

      invoice.dueAmount = dueAmount;

      if (invoice.paidAmount <= 0) {
        invoice.paymentStatus = "Pending";
      } else if (invoice.paidAmount >= order.grandTotal) {
        invoice.paymentStatus = "Paid";
        invoice.dueAmount = 0;
      } else {
        invoice.paymentStatus = "Partially Paid";
      }

      order.paymentStatus = invoice.paymentStatus;
      await order.save();
    }

    await invoice.save();

    const updatedInvoice = await Invoice.findById(invoice._id).populate({
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

    res.status(200).json({
      message: "Invoice updated successfully",
      invoice: updatedInvoice,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ============================
// Delete Invoice
// ============================
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    const order = await Order.findById(invoice.order);

    if (order) {
      order.paymentStatus = "Pending";
      await order.save();
    }

    await Invoice.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};