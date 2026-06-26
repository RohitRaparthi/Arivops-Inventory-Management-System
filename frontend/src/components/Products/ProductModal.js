import React, { useEffect, useState } from "react";
import "./ProductModal.css";

const initialState = {
  sku: "",
  productName: "",
  variant: "",
  currentStock: "",
  reorderLevel: "",
  costPrice: "",
  sellingPrice: "",
};

const ProductModal = ({
  isOpen,
  onClose,
  onSave,
  editingProduct,
}) => {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (editingProduct) {
      setForm(editingProduct);
    } else {
      setForm(initialState);
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      ...form,
      currentStock: Number(form.currentStock),
      reorderLevel: Number(form.reorderLevel),
      costPrice: Number(form.costPrice),
      sellingPrice: Number(form.sellingPrice),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">

      <div className="modal">

        <div className="modal-header">
          <h2>
            {editingProduct
              ? "Edit Product"
              : "Add Product"}
          </h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <input
            name="sku"
            placeholder="SKU"
            value={form.sku}
            onChange={handleChange}
            required
          />

          <input
            name="productName"
            placeholder="Product Name"
            value={form.productName}
            onChange={handleChange}
            required
          />

          <input
            name="variant"
            placeholder="Variant"
            value={form.variant}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="currentStock"
            placeholder="Current Stock"
            value={form.currentStock}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="reorderLevel"
            placeholder="Reorder Level"
            value={form.reorderLevel}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="costPrice"
            placeholder="Cost Price"
            value={form.costPrice}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="sellingPrice"
            placeholder="Selling Price"
            value={form.sellingPrice}
            onChange={handleChange}
            required
          />

          <div className="modal-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
            >
              Save Product
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default ProductModal;