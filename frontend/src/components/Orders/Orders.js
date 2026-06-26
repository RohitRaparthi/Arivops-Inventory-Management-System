import React, { useEffect, useState } from "react";
import "./Orders.css";
import OrderForm from "./OrderForm";

function Orders() {

  const API_URL = "https://arivops-inventory-management-system.onrender.com/api/orders";

  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingOrder, setEditingOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchOrders();

  }, []);

  // ===========================
  // Fetch Orders
  // ===========================

  const fetchOrders = async () => {

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

      setOrders(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  // ===========================
  // Delete Order
  // ===========================

  const handleDelete = async (id) => {

    if (
      !window.confirm(
        "Delete this order?"
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

      fetchOrders();

    } catch (error) {

      console.error(error);

    }

  };

  // ===========================
  // Download PDF
  // ===========================

  const downloadInvoice = async (id) => {

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await fetch(
          `https://arivops-inventory-management-system.onrender.com/api/invoices/${id}/pdf`,
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
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "invoice.pdf";

      link.click();

    } catch (error) {

      console.error(error);

    }

  };

  // ===========================
  // Export Excel
  // ===========================

  const exportExcel = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await fetch(
          "https://arivops-inventory-management-system.onrender.com/api/export/orders",
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
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "orders.xlsx";

      link.click();

    } catch (error) {

      console.error(error);

    }

  };

  // ===========================
  // Search
  // ===========================

  const filteredOrders =
    orders.filter((order) => {

      const text =
        search.toLowerCase();

      return (

        order.orderNumber
          .toLowerCase()
          .includes(text)

        ||

        order.customer.customerName
          .toLowerCase()
          .includes(text)

      );

    });
      // ===========================
  // Add Order
  // ===========================

  const handleAddOrder = () => {
    setEditingOrder(null);
    setShowForm(true);
  };

  // ===========================
  // Edit Order
  // ===========================

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setShowForm(true);
  };

  // ===========================
  // Status Badge
  // ===========================

  const getStatusClass = (status) => {
    switch (status) {
      case "Paid":
        return "status-paid";

      case "Partially Paid":
        return "status-partial";

      case "Pending":
        return "status-pending";

      default:
        return "";
    }
  };

  // ===========================
  // Order Status Badge
  // ===========================

  const getOrderStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "order-completed";

      case "Cancelled":
        return "order-cancelled";

      default:
        return "order-created";
    }
  };

  return (
  <div className="orders-page">

    <div className="orders-header">

      <div>
        <h2>Orders</h2>
        <p>Manage Customer Orders</p>
      </div>

      <div className="orders-actions">

        <input
          type="text"
          placeholder="Search Order..."
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
          onClick={handleAddOrder}
        >
          + Create Order
        </button>

      </div>

    </div>

    {showForm && (
      <OrderForm
        editingOrder={editingOrder}
        onClose={() => {
          setShowForm(false);
          setEditingOrder(null);
        }}
        onRefresh={fetchOrders}
      />
    )}

    <div className="orders-table-container">

      <table className="orders-table">

        <thead>

          <tr>
            <th>Order No</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Subtotal</th>
            <th>Grand Total</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>

        </thead>

          <tbody>

{loading ? (

<tr>

<td colSpan="9">
Loading...
</td>

</tr>

) : filteredOrders.length === 0 ? (

<tr>

<td colSpan="9">
No Orders Found
</td>

</tr>

) : (

filteredOrders.map((order) => (

<tr key={order._id}>

<td>{order.orderNumber}</td>

<td>
{order.customer.customerName}
</td>

<td>
{order.items.length}
</td>

<td>
₹{order.subtotal.toFixed(2)}
</td>

<td>
₹{order.grandTotal.toFixed(2)}
</td>

<td>

<span
className={
getStatusClass(
order.paymentStatus
)
}
>

{order.paymentStatus}

</span>

</td>

<td>

<span
className={
getOrderStatusClass(
order.orderStatus
)
}
>

{order.orderStatus}

</span>

</td>

<td>

{new Date(
order.createdAt
).toLocaleDateString()}

</td>

<td className="action-buttons">

<button
className="edit-btn"
onClick={() =>
handleEditOrder(order)
}
>

Edit

</button>

<button
className="pdf-btn"
onClick={() =>
downloadInvoice(
order._id
)
}
>

PDF

</button>

<button
className="delete-btn"
onClick={() =>
handleDelete(
order._id
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
}

export default Orders;