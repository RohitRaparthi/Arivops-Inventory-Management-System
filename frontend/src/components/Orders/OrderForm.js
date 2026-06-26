import React, { useEffect, useState } from "react";

function OrderForm({ editingOrder, onClose, onRefresh }) {
  const API_URL = "http://localhost:5000/api";

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    customer: "",
    items: [],
    subtotal: 0,
    gstPercentage: 18,
    gstAmount: 0,
    grandTotal: 0,
  });

  useEffect(() => {
    fetchCustomers();
    fetchProducts();

    if (editingOrder) {
    const items = editingOrder.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
    }));

    setFormData({
        customer: editingOrder.customer._id,
        items,
        subtotal: editingOrder.subtotal,
        gstPercentage: editingOrder.gstPercentage,
        gstAmount: editingOrder.gstAmount,
        grandTotal: editingOrder.grandTotal,
    });

    calculateTotals(items);
    }
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/customers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setCustomers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          product: "",
          quantity: 1,
        },
      ],
    });
  };

  const removeProduct = (index) => {
    const items = [...formData.items];

    items.splice(index, 1);

    setFormData({
      ...formData,
      items,
    });

    calculateTotals(items);
  };

  const handleCustomer = (e) => {
    setFormData({
      ...formData,
      customer: e.target.value,
    });
  };

  const handleProductChange = (
    index,
    field,
    value
  ) => {
    const items = [...formData.items];

    if (field === "product") {

    const exists = items.some(
        (p, i) =>
        i !== index &&
        p.product === value
    );

    if (exists) {
        alert("Product already added.");
        return;
    }
    }
  };

  const calculateTotals = (items) => {
    let subtotal = 0;

    items.forEach((item) => {
      const product = products.find(
        (p) => p._id === item.product
      );

      if (product) {
        subtotal +=
          product.sellingPrice * item.quantity;
      }
    });

    const gstAmount =
      subtotal * 18 / 100;

    const grandTotal =
      subtotal + gstAmount;

    setFormData((prev) => ({
      ...prev,
      items,
      subtotal,
      gstAmount,
      grandTotal,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        editingOrder
          ? `${API_URL}/orders/${editingOrder._id}`
          : `${API_URL}/orders`,
        {
          method: editingOrder
            ? "PUT"
            : "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(formData),
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        onRefresh();
        onClose();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">

      <div className="modal-content">

        <div className="modal-header">

          <h2>
            {editingOrder
              ? "Edit Order"
              : "Create Order"}
          </h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label>
              Customer
            </label>

            <select
              value={formData.customer}
              onChange={
                handleCustomer
              }
              required
            >

              <option value="">
                Select Customer
              </option>

              {customers.map(
                (customer) => (
                  <option
                    key={
                      customer._id
                    }
                    value={
                      customer._id
                    }
                  >
                    {
                      customer.customerName
                    }
                  </option>
                )
              )}

            </select>

          </div>

          <hr />

          <h3>
            Products ({formData.items.length})
          </h3>

          {formData.items.map(
            (item, index) => (
              <div
                key={index}
                className="order-row"
              >
                <select
                  value={item.product}
                  onChange={(e) =>
                    handleProductChange(
                      index,
                      "product",
                      e.target.value
                    )
                  }
                  required
                >
                  <option value="">
                    Select Product
                  </option>

                  {products
                    .filter((product) => product.currentStock > 0)
                    .map((product) => (
                    <option
                      key={product._id}
                      value={product._id}
                    >
                      {product.productName} (
                      {product.variant}) -
                      ₹{product.sellingPrice}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleProductChange(
                      index,
                      "quantity",
                      e.target.value
                    )
                  }
                />
                <span className="price-label">
                ₹{
                products.find(
                    p => p._id === item.product
                )?.sellingPrice || 0
                }
                </span>

                <span className="row-total">

                    ₹{
                    (
                    (products.find(
                    p => p._id === item.product
                    )?.sellingPrice || 0)

                    * item.quantity

                    ).toFixed(2)
                    }

                    </span>

                <button
                  type="button"
                  className="remove-btn"
                  onClick={() =>
                    removeProduct(index)
                  }
                >
                  Remove
                </button>

              </div>
            )
          )}

          <button
            type="button"
            className="add-product-btn"
            onClick={addProduct}
          >
            + Add Product
          </button>

          <div className="totals">

            <div className="total-row">
              <span>Subtotal</span>

              <span>
                ₹
                {formData.subtotal.toFixed(2)}
              </span>
            </div>

            <div className="total-row">

              <span>
                GST (
                {formData.gstPercentage}%)
              </span>

              <span>
                ₹
                {formData.gstAmount.toFixed(2)}
              </span>

            </div>

            <div className="total-row grand-total">

              <span>Grand Total</span>

              <span>
                ₹
                {formData.grandTotal.toFixed(
                  2
                )}
              </span>
                <div className="total-row">

                <span>Total Items</span>
                <span>

                {formData.items.reduce(

                (sum,item)=>sum+item.quantity,

                0

                )}

                </span>

                </div>
            </div>

          </div>

          <div className="form-actions">

            <button
                type="submit"
                disabled={
                !formData.customer ||
                formData.items.length === 0
                }
            >
              {editingOrder
                ? "Update Order"
                : "Create Order"}
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

export default OrderForm;