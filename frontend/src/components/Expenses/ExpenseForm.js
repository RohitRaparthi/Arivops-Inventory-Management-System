import React, { useEffect, useState } from "react";

function ExpenseForm({ editingExpense, onClose, onRefresh }) {
  const API_URL = "https://arivops-inventory-management-system.onrender.com/api/expenses";

  const [formData, setFormData] = useState({
    category: "",
    description: "",
    amount: "",
    vendor: "",
    date: "",
  });

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        category: editingExpense.category || "",
        description: editingExpense.description || "",
        amount: editingExpense.amount || "",
        vendor: editingExpense.vendor || "",
        date: editingExpense.date
          ? editingExpense.date.substring(0, 10)
          : "",
      });
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        editingExpense
          ? `${API_URL}/${editingExpense._id}`
          : API_URL,
        {
          method: editingExpense ? "PUT" : "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            ...formData,
            amount: Number(formData.amount),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(
          editingExpense
            ? "Expense updated successfully."
            : "Expense added successfully."
        );

        onRefresh();
        onClose();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">

        <div className="modal-header">
          <h2>
            {editingExpense
              ? "Edit Expense"
              : "Add Expense"}
          </h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Category</label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Amount</label>

            <input
              type="number"
              name="amount"
              min="1"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Vendor</label>

            <input
              type="text"
              name="vendor"
              value={formData.vendor}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Expense Date</label>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">

            <button
              type="submit"
              className="btn btn-primary"
            >
              {editingExpense
                ? "Update Expense"
                : "Save Expense"}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default ExpenseForm;