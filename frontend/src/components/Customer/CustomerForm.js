import React, { useEffect, useState } from "react";

function CustomerForm({ editingCustomer, onClose, onRefresh }) {
  const API_URL = "http://localhost:5000/api/customers";

  const [formData, setFormData] = useState({
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    if (editingCustomer) {
      setFormData({
        customerName: editingCustomer.customerName || "",
        contactNumber: editingCustomer.contactNumber || "",
        email: editingCustomer.email || "",
        address: editingCustomer.address || "",
      });
    }
  }, [editingCustomer]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const url = editingCustomer
        ? `${API_URL}/${editingCustomer._id}`
        : API_URL;

      const method = editingCustomer ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        onRefresh();
        onClose();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Unable to save customer");
    }
  };

  return (
    <div className="modal-overlay">

      <div className="modal-content">

        <div className="modal-header">

          <h2>
            {editingCustomer ? "Edit Customer" : "Add Customer"}
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

            <label>Customer Name</label>

            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-group">

            <label>Contact Number</label>

            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

          </div>

          <div className="form-group">

            <label>Address</label>

            <textarea
              rows="3"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />

          </div>

          <div className="form-actions">

            <button
              className="btn btn-primary"
              type="submit"
            >
              {editingCustomer ? "Update" : "Save"}
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

export default CustomerForm;