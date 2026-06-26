import React, { useState } from 'react';

function StockMovement({ product, onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    movementType: 'IN',
    quantity: 0,
    notes: '',
  });

  const API_URL = 'https://arivops-inventory-management-system.onrender.com/api';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/stock-movements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          ...formData,
        }),
      });

      if (response.ok) {
        onRefresh();
        onClose();
      }
    } catch (error) {
      console.error('Error logging stock movement:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Log Stock Movement</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="product-info">
          <p><strong>Product:</strong> {product.productName} ({product.variant})</p>
          <p><strong>Current Stock:</strong> {product.currentStock}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Movement Type:</label>
            <select 
              name="movementType" 
              value={formData.movementType} 
              onChange={handleChange}
            >
              <option value="IN">Stock IN (Receipt)</option>
              <option value="OUT">Stock OUT (Dispatch)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Quantity:</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Notes:</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter reason for stock movement"
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Log Movement
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StockMovement;
