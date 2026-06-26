import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxes,
  FaUsers,
  FaShoppingCart,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaChartBar,
  FaSignOutAlt,
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/dashboard",
    },
    {
      title: "Products",
      icon: <FaBoxes />,
      path: "/products",
    },
    {
      title: "Customers",
      icon: <FaUsers />,
      path: "/customers",
    },
    {
      title: "Orders",
      icon: <FaShoppingCart />,
      path: "/orders",
    },
    {
      title: "Invoices",
      icon: <FaFileInvoiceDollar />,
      path: "/invoices",
    },
    {
      title: "Expenses",
      icon: <FaMoneyBillWave />,
      path: "/expenses",
    },
    {
      title: "Reports",
      icon: <FaChartBar />,
      path: "/reports",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>ArviOps</h2>
        <span>Inventory Management</span>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <span className="menu-icon">{item.icon}</span>
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;