import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./Dashboard.css";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalInvoices: 0,
    totalExpenses: 0,
    totalRevenue: 0,
    totalExpenseAmount: 0,
    profit: 0,
    inventoryValue: 0,
    totalStock: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/reports/dashboard");
      setDashboard(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="dashboard">

      <h1 className="dashboard-title">
        Dashboard Overview
      </h1>

      <div className="dashboard-grid">

        <div className="card">
          <h3>Total Products</h3>
          <h1>{dashboard.totalProducts}</h1>
        </div>

        <div className="card">
          <h3>Total Customers</h3>
          <h1>{dashboard.totalCustomers}</h1>
        </div>

        <div className="card">
          <h3>Total Orders</h3>
          <h1>{dashboard.totalOrders}</h1>
        </div>

        <div className="card">
          <h3>Total Invoices</h3>
          <h1>{dashboard.totalInvoices}</h1>
        </div>

        <div className="card">
          <h3>Total Stock</h3>
          <h1>{dashboard.totalStock}</h1>
        </div>

        <div className="card">
          <h3>Inventory Value</h3>
          <h1>
            ₹
            {dashboard.inventoryValue.toLocaleString()}
          </h1>
        </div>

        <div className="card revenue">
          <h3>Total Revenue</h3>
          <h1>
            ₹
            {dashboard.totalRevenue.toLocaleString()}
          </h1>
        </div>

        <div className="card expense">
          <h3>Total Expenses</h3>
          <h1>
            ₹
            {dashboard.totalExpenseAmount.toLocaleString()}
          </h1>
        </div>

        <div className="card profit">
          <h3>Net Profit</h3>
          <h1>
            ₹
            {dashboard.profit.toLocaleString()}
          </h1>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;