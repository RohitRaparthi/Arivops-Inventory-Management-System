import React, { useMemo } from "react";
import {
  FaBell,
  FaUserCircle,
  FaSearch,
} from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const currentDate = useMemo(() => {
    return new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  const userName =
    localStorage.getItem("userName") || "Admin";

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h2>Dashboard</h2>
        <p>{currentDate}</p>
      </div>

      <div className="navbar-center">
        <div className="search-box">
          <FaSearch className="search-icon" />

          <input
            type="text"
            placeholder="Search products, customers, invoices..."
          />
        </div>
      </div>

      <div className="navbar-right">
        <button
          className="notification-btn"
          title="Notifications"
        >
          <FaBell />
          <span className="notification-badge">3</span>
        </button>

        <div className="user-profile">
          <FaUserCircle className="user-icon" />

          <div>
            <h4>{userName}</h4>
            <span>Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;