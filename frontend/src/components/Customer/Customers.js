import React, { useEffect, useState } from "react";
import "./Customers.css";
import CustomerForm from "./CustomerForm";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  

  const API_URL = "https://arivops-inventory-management-system.onrender.com/api/customers";

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setCustomers(data);
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;

    try {
      const token = localStorage.getItem("token");

      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchCustomers();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.customerName
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="customers-page">

      <div className="customers-header">

        <div>
          <h2>Customers</h2>
          <p>Manage Customers</p>
        </div>

        <button
            className="add-btn"
            onClick={() => {
                setEditingCustomer(null);
                setShowForm(true);
            }}
        >
            + Add Customer
        </button>
        {
            showForm && (
                <CustomerForm
                    editingCustomer={editingCustomer}
                    onClose={()=>{
                        setShowForm(false);
                        setEditingCustomer(null);
                    }}
                    onRefresh={fetchCustomers}
                />
            )
        }

      </div>

      <div className="customers-toolbar">

        <input
          type="text"
          placeholder="Search Customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      <div className="customers-table-container">

        <table className="customers-table">

          <thead>

            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {filteredCustomers.length === 0 ? (

              <tr>
                <td colSpan="5" className="no-data">
                  No Customers Found
                </td>
              </tr>

            ) : (

              filteredCustomers.map((customer) => (

                <tr key={customer._id}>

                  <td>{customer.customerName}</td>

                  <td>{customer.contactNumber}</td>

                  <td>{customer.email}</td>

                  <td>{customer.address}</td>

                  <td className="action-buttons">

                    <button
                        className="edit-btn"
                        onClick={() => {
                            setEditingCustomer(customer);
                            setShowForm(true);
                        }}
                    >
                        Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(customer._id)}
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
}

export default Customers;