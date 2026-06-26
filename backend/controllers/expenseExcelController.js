const ExcelJS = require("exceljs");
const Expense = require("../models/Expense");

// ===========================================
// Export Expenses to Excel
// ===========================================
exports.exportExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({
      expenseDate: -1,
    });

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "ArviOps";
    workbook.company = "ArviOps Inventory Management";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Expenses");

    worksheet.columns = [
      {
        header: "Expense No",
        key: "expenseNumber",
        width: 18,
      },
      {
        header: "Expense Name",
        key: "expenseName",
        width: 30,
      },
      {
        header: "Category",
        key: "category",
        width: 20,
      },
      {
        header: "Amount",
        key: "amount",
        width: 15,
      },
      {
        header: "Payment Method",
        key: "paymentMethod",
        width: 20,
      },
      {
        header: "Vendor",
        key: "vendor",
        width: 25,
      },
      {
        header: "Description",
        key: "description",
        width: 35,
      },
      {
        header: "Expense Date",
        key: "expenseDate",
        width: 18,
      },
      {
        header: "Created Date",
        key: "createdAt",
        width: 18,
      },
    ];

    // Header Style
    const header = worksheet.getRow(1);

    header.font = {
      bold: true,
      color: {
        argb: "FFFFFFFF",
      },
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

    // Add Rows
    expenses.forEach((expense) => {
      worksheet.addRow({
        expenseNumber: expense.expenseNumber,
        expenseName: expense.expenseName,
        category: expense.category,
        amount: expense.amount,
        paymentMethod: expense.paymentMethod,
        vendor: expense.vendor,
        description: expense.description,
        expenseDate: new Date(
          expense.expenseDate
        ).toLocaleDateString(),
        createdAt: new Date(
          expense.createdAt
        ).toLocaleDateString(),
      });
    });

    // Currency Formatting
    worksheet.getColumn("D").numFmt = "₹#,##0.00";

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
      'attachment; filename="expenses.xlsx"'
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