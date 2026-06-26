import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login/Login';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import StockMovement from './components/StockMovement';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard/Dashboard';
import Customers from './components/Customer/Customers';
import Orders from './components/Orders/Orders';
import Invoices from './components/Invoices/Invoices';
import Expenses from './components/Expenses/Expenses';
import Reports from './components/Reports/Reports';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showStockMovement, setShowStockMovement] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const API_URL = 'https://arivops-inventory-management-system.onrender.com/api';

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsLoggedIn(true);
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  // Fetch products only when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchProducts();
    }
  }, [isLoggedIn]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setProducts([]);
    setCurrentPage('dashboard');
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
    setShowStockMovement(false);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
    setShowStockMovement(false);
  };

  const handleStockMovement = (product) => {
    setSelectedProduct(product);
    setShowStockMovement(true);
    setShowProductForm(false);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`${API_URL}/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleProductFormClose = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const handleStockMovementClose = () => {
    setShowStockMovement(false);
    setSelectedProduct(null);
    fetchProducts();
  };

  // Login Page
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }
// Render different pages
  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <Dashboard
            products={products}
            currentUser={currentUser}
          />
        );
      case 'inventory':
        return (
          <div className="container">
            <div className="button-group">
              <button 
                className="btn btn-primary" 
                onClick={handleAddProduct}
              >
                + Add New Product
              </button>
            </div>

            {showProductForm && (
              <ProductForm
                onClose={handleProductFormClose}
                editingProduct={editingProduct}
                onRefresh={fetchProducts}
              />
            )}

            {showStockMovement && selectedProduct && (
              <StockMovement
                product={selectedProduct}
                onClose={handleStockMovementClose}
                onRefresh={fetchProducts}
              />
            )}

            <ProductList
              products={products}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onStockMovement={handleStockMovement}
            />
          </div>
        );
      case 'customers':
        return <Customers />;
      case 'orders':
        return <Orders />;
      case 'invoices':
        return <Invoices />;
      case 'expenses':
        return <Expenses />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  // Main Dashboard
  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div className="header-left">
            <h1>ArviOps</h1>
            <p>Arvi Edibles Inventory Management</p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-name">{currentUser?.fullName || currentUser?.username}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="main-container">
        <div className="top-navbar">

  <button
    className={`nav-btn ${
      currentPage === "dashboard" ? "active" : ""
    }`}
    onClick={() => setCurrentPage("dashboard")}
  >
    📊 Dashboard
  </button>

  <button
    className={`nav-btn ${
      currentPage === "inventory" ? "active" : ""
    }`}
    onClick={() => setCurrentPage("inventory")}
  >
    📦 Inventory
  </button>

  <button
    className={`nav-btn ${
      currentPage === "customers" ? "active" : ""
    }`}
    onClick={() => setCurrentPage("customers")}
  >
    👥 Customers
  </button>

  <button
    className={`nav-btn ${
      currentPage === "orders" ? "active" : ""
    }`}
    onClick={() => setCurrentPage("orders")}
  >
    📝 Orders
  </button>

  <button
    className={`nav-btn ${
      currentPage === "invoices" ? "active" : ""
    }`}
    onClick={() => setCurrentPage("invoices")}
  >
    🧾 Invoices
  </button>

  <button
    className={`nav-btn ${
      currentPage === "expenses" ? "active" : ""
    }`}
    onClick={() => setCurrentPage("expenses")}
  >
    💸 Expenses
  </button>

  <button
    className={`nav-btn ${
      currentPage === "reports" ? "active" : ""
    }`}
    onClick={() => setCurrentPage("reports")}
  >
    📈 Reports
  </button>

</div>

<ProtectedRoute isLoggedIn={isLoggedIn}>
  <div className="page-content">
    {renderPage()}
  </div>
</ProtectedRoute>
      </div>
    </div>
  );
}

export default App;
