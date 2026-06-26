import React, { useEffect, useState } from "react";
import "./Reports.css";

function Reports() {

  const API_URL =
    "https://arivops-inventory-management-system.onrender.com/api/reports";

  const [report, setReport] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchReport();

  }, []);

  const fetchReport = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await fetch(
          `${API_URL}/dashboard`,
          {

            headers: {

              Authorization:
                `Bearer ${token}`,

            },

          }
        );

      const data =
        await response.json();

      setReport(data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  if (loading) {

    return <h2>Loading...</h2>;

  }

  return (

    <div className="reports-page">

      <div className="reports-header">

        <h2>Reports</h2>

        <button
          className="refresh-btn"
          onClick={fetchReport}
        >
          Refresh
        </button>

      </div>

      <div className="report-grid">

        <div className="report-card">

          <h3>Total Revenue</h3>

          <h1>

            ₹
            {report.totalRevenue.toLocaleString()}

          </h1>

        </div>

        <div className="report-card">

          <h3>Total Expenses</h3>

          <h1>

            ₹
            {report.totalExpenseAmount.toLocaleString()}

          </h1>

        </div>

        <div className="report-card">

          <h3>Net Profit</h3>

          <h1>

            ₹
            {report.profit.toLocaleString()}

          </h1>

        </div>

        <div className="report-card">

          <h3>Inventory Value</h3>

          <h1>

            ₹
            {report.inventoryValue.toLocaleString()}

          </h1>

        </div>

        <div className="report-card">

          <h3>Total Products</h3>

          <h1>

            {report.totalProducts}

          </h1>

        </div>

        <div className="report-card">

          <h3>Total Customers</h3>

          <h1>

            {report.totalCustomers}

          </h1>

        </div>

        <div className="report-card">

          <h3>Total Orders</h3>

          <h1>

            {report.totalOrders}

          </h1>

        </div>

        <div className="report-card">

          <h3>Total Invoices</h3>

          <h1>

            {report.totalInvoices}

          </h1>

        </div>

        <div className="report-card">

          <h3>Total Stock</h3>

          <h1>

            {report.totalStock}

          </h1>

        </div>

      </div>

    </div>

  );

}

export default Reports;