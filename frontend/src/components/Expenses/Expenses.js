import React, { useEffect, useState } from "react";
import "./Expenses.css";
import ExpenseForm from "./ExpenseForm";

function Expenses() {

  const API_URL =
    "http://localhost:5000/api/expenses";

  const [expenses, setExpenses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingExpense, setEditingExpense] =
    useState(null);

  useEffect(() => {

    fetchExpenses();

  }, []);

  // ==========================
  // Fetch Expenses
  // ==========================

  const fetchExpenses = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await fetch(API_URL, {

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

        });

      const data =
        await response.json();

      setExpenses(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  // ==========================
  // Delete Expense
  // ==========================

  const handleDelete = async (id) => {

    if (
      !window.confirm(
        "Delete this expense?"
      )
    ) return;

    try {

      const token =
        localStorage.getItem("token");

      await fetch(
        `${API_URL}/${id}`,
        {

          method: "DELETE",

          headers: {

            Authorization:
              `Bearer ${token}`,

          },

        }
      );

      fetchExpenses();

    } catch (error) {

      console.error(error);

    }

  };

  // ==========================
  // Export Excel
  // ==========================

  const exportExcel = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await fetch(

          "http://localhost:5000/api/export/expenses",

          {

            headers: {

              Authorization:
                `Bearer ${token}`,

            },

          }

        );

      const blob =
        await response.blob();

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "expenses.xlsx";

      link.click();

    } catch (error) {

      console.error(error);

    }

  };

  // ==========================
  // Search
  // ==========================

  const filteredExpenses =
    expenses.filter((expense) => {

      const text =
        search.toLowerCase();

      return (

        expense.category
          .toLowerCase()
          .includes(text)

        ||

        expense.description
          .toLowerCase()
          .includes(text)

      );

    });
      // ==========================
  // Add Expense
  // ==========================

  const handleAddExpense = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  // ==========================
  // Edit Expense
  // ==========================

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  return (
  <div className="expenses-page">

    <div className="expenses-header">

      <div>
        <h2>Expenses</h2>
        <p>Manage Business Expenses</p>
      </div>

      <div className="expenses-actions">

        <input
          type="text"
          placeholder="Search Expense..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <button
          className="excel-btn"
          onClick={exportExcel}
        >
          Export Excel
        </button>

        <button
          className="add-btn"
          onClick={handleAddExpense}
        >
          + Add Expense
        </button>

      </div>

    </div>

    {showForm && (
      <ExpenseForm
        editingExpense={editingExpense}
        onClose={() => {
          setShowForm(false);
          setEditingExpense(null);
        }}
        onRefresh={fetchExpenses}
      />
    )}

    <div className="expenses-table-container">

      <table className="expenses-table">

        <thead>

          <tr>

            <th>Category</th>

            <th>Description</th>

            <th>Amount</th>

            <th>Vendor</th>

            <th>Expense Date</th>

            <th>Created</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {loading ? (

            <tr>

              <td
                colSpan="7"
                className="no-data"
              >
                Loading...
              </td>

            </tr>

          ) : filteredExpenses.length === 0 ? (

            <tr>

              <td
                colSpan="7"
                className="no-data"
              >
                No Expenses Found
              </td>

            </tr>

          ) : (

            filteredExpenses.map((expense) => (

              <tr key={expense._id}>

                <td>
                  {expense.category}
                </td>

                <td>
                  {expense.description}
                </td>

                <td>
                  ₹
                  {Number(
                    expense.amount
                  ).toFixed(2)}
                </td>

                <td>
                  {expense.vendor || "-"}
                </td>

                <td>
                  {expense.date
                    ? new Date(
                        expense.date
                      ).toLocaleDateString()
                    : "-"}
                </td>

                <td>
                  {new Date(
                    expense.createdAt
                  ).toLocaleDateString()}
                </td>

                <td className="action-buttons">

                  <button
                    className="edit-btn"
                    onClick={() =>
                      handleEditExpense(
                        expense
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(
                        expense._id
                      )
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  </div>
);
};

export default Expenses