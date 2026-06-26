import React from 'react';

function ProductList({ products, onEdit, onDelete, onStockMovement }) {
  const getStockHealthClass = (health) => {
    return `stock-health ${health}`;
  };

  return (
    <div className="product-list">
      <h2>Product Inventory</h2>
      {products.length === 0 ? (
        <p>No products available. Add a new product to get started.</p>
      ) : (
        <table className="products-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Variant</th>
              <th>Current Stock</th>
              <th>Reorder Level</th>
              <th>Cost Price</th>
              <th>Selling Price</th>
              <th>Health</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.sku}</td>
                <td>{product.productName}</td>
                <td>{product.variant}</td>
                <td>{product.currentStock}</td>
                <td>{product.reorderLevel}</td>
                <td>₹{product.costPrice.toFixed(2)}</td>
                <td>₹{product.sellingPrice.toFixed(2)}</td>
                <td>
                  <span className={getStockHealthClass(product.stockHealth)}>
                    {product.stockHealth.toUpperCase()}
                  </span>
                </td>
                <td className="actions">
                  <button 
                    className="btn btn-sm btn-edit" 
                    onClick={() => onEdit(product)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-stock" 
                    onClick={() => onStockMovement(product)}
                  >
                    Stock
                  </button>
                  <button 
                    className="btn btn-sm btn-danger" 
                    onClick={() => onDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProductList;
