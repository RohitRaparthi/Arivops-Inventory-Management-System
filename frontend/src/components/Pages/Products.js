import React, { useEffect, useMemo, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaFileExcel,
  FaPlus,
} from "react-icons/fa";

import productService from "../services/productService";

import Table from "../components/Common/Table";
import Button from "../components/Common/Button";
import SearchBar from "../components/Common/SearchBar";
import ProductModal from "../components/Products/ProductModal";
import ConfirmDialog from "../components/Common/ConfirmDialog";

import "./Products.css";

const Products = () => {

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [deleteDialog, setDeleteDialog] =
    useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  // ===========================
  // Fetch Products
  // ===========================

  const fetchProducts = async () => {

    try {

      const { data } =
        await productService.getProducts();

      setProducts(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchProducts();

  }, []);

  // ===========================
  // Search
  // ===========================

  const filteredProducts = useMemo(() => {

    return products.filter((product) => {

      const text = search.toLowerCase();

      return (
        product.productName
          .toLowerCase()
          .includes(text) ||

        product.sku
          .toLowerCase()
          .includes(text) ||

        product.variant
          .toLowerCase()
          .includes(text)
      );

    });

  }, [products, search]);

  // ===========================
  // Excel Export
  // ===========================

  const exportExcel = async () => {

    try {

      const response =
        await productService.exportExcel();

      const url =
        window.URL.createObjectURL(
          new Blob([response.data])
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.download = "products.xlsx";

      document.body.appendChild(link);

      link.click();

      link.remove();

    } catch (error) {

      console.error(error);

    }

  };

  // ===========================
  // Table Columns
  // ===========================

  const columns = [

    {
      title: "SKU",
      key: "sku",
    },

    {
      title: "Product",
      key: "productName",
    },

    {
      title: "Variant",
      key: "variant",
    },

    {
      title: "Stock",
      key: "currentStock",
    },

    {
      title: "Reorder",
      key: "reorderLevel",
    },

    {
      title: "Cost",
      render: (row) =>
        `₹${row.costPrice}`,
    },

    {
      title: "Selling",
      render: (row) =>
        `₹${row.sellingPrice}`,
    },

    {
      title: "Health",

      render: (row) => (

        <span
          className={`stock-badge ${row.stockHealth}`}
        >
          {row.stockHealth}
        </span>

      ),

    },

    {
      title: "Actions",

      render: (row) => (

        <div className="action-buttons">

          <Button
            size="small"
            variant="warning"
            icon={<FaEdit />}
          >
            Edit
          </Button>

          <Button
            size="small"
            variant="danger"
            icon={<FaTrash />}
          >
            Delete
          </Button>

        </div>

      ),

    },

  ];
    // ===========================
  // Open Add Product Modal
  // ===========================

  const handleAddProduct = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  // ===========================
  // Open Edit Product Modal
  // ===========================

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  // ===========================
  // Save Product
  // ===========================

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await productService.updateProduct(
          editingProduct._id,
          productData
        );
      } else {
        await productService.createProduct(productData);
      }

      setModalOpen(false);
      setEditingProduct(null);

      fetchProducts();

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Unable to save product."
      );
    }
  };

  // ===========================
  // Delete Dialog
  // ===========================

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setDeleteDialog(true);
  };

  // ===========================
  // Delete Product
  // ===========================

  const confirmDelete = async () => {
    if (!selectedProduct) return;

    try {
      await productService.deleteProduct(
        selectedProduct._id
      );

      setDeleteDialog(false);
      setSelectedProduct(null);

      fetchProducts();

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Unable to delete product."
      );
    }
  };
    return (
    <div className="products-page">

      {/* ================= Header ================= */}

      <div className="products-header">

        <div>

          <h1>Products</h1>

          <p>
            Manage your inventory products
          </p>

        </div>

        <div className="products-actions">

          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by SKU, name or variant..."
          />

          <Button
            variant="outline"
            icon={<FaFileExcel />}
            onClick={exportExcel}
          >
            Export Excel
          </Button>

          <Button
            variant="primary"
            icon={<FaPlus />}
            onClick={handleAddProduct}
          >
            Add Product
          </Button>

        </div>

      </div>

      {/* ================= Table ================= */}

      <Table
        columns={columns}
        data={filteredProducts}
        loading={loading}
        emptyMessage="No products available."
      />

      {/* ================= Product Modal ================= */}

      <ProductModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProduct(null);
        }}
        editingProduct={editingProduct}
        onSave={handleSaveProduct}
      />

      {/* ================= Delete Dialog ================= */}

      <ConfirmDialog
        open={deleteDialog}
        title="Delete Product"
        message={`Are you sure you want to delete "${
          selectedProduct?.productName || ""
        }"?`}
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => {
          setDeleteDialog(false);
          setSelectedProduct(null);
        }}
        onConfirm={confirmDelete}
      />

    </div>
  );

};

export default Products;