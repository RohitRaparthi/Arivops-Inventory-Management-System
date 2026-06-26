const Expense = require("../models/Expense");

// ===============================
// Generate Expense Number
// ===============================
const generateExpenseNumber = async () => {
  const count = await Expense.countDocuments();
  return "EXP" + String(count + 1).padStart(5, "0");
};

// ===============================
// Get All Expenses
// ===============================
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({
      expenseDate: -1,
      createdAt: -1,
    });

    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Get Expense By ID
// ===============================
exports.getExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.status(200).json(expense);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Create Expense
// ===============================
exports.createExpense = async (req, res) => {
  try {
    const {
      expenseName,
      category,
      amount,
      paymentMethod,
      vendor,
      description,
      expenseDate,
    } = req.body;

    if (!expenseName || !category || amount === undefined) {
      return res.status(400).json({
        message: "Expense name, category and amount are required",
      });
    }

    if (Number(amount) < 0) {
      return res.status(400).json({
        message: "Amount cannot be negative",
      });
    }

    const expenseNumber = await generateExpenseNumber();

    const expense = await Expense.create({
      expenseNumber,
      expenseName,
      category,
      amount: Number(amount),
      paymentMethod,
      vendor,
      description,
      expenseDate,
    });

    res.status(201).json({
      message: "Expense created successfully",
      expense,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Update Expense
// ===============================
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    const {
      expenseName,
      category,
      amount,
      paymentMethod,
      vendor,
      description,
      expenseDate,
    } = req.body;

    if (expenseName !== undefined) {
      expense.expenseName = expenseName;
    }

    if (category !== undefined) {
      expense.category = category;
    }

    if (amount !== undefined) {
      if (Number(amount) < 0) {
        return res.status(400).json({
          message: "Amount cannot be negative",
        });
      }

      expense.amount = Number(amount);
    }

    if (paymentMethod !== undefined) {
      expense.paymentMethod = paymentMethod;
    }

    if (vendor !== undefined) {
      expense.vendor = vendor;
    }

    if (description !== undefined) {
      expense.description = description;
    }

    if (expenseDate !== undefined) {
      expense.expenseDate = expenseDate;
    }

    await expense.save();

    res.status(200).json({
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Delete Expense
// ===============================
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};