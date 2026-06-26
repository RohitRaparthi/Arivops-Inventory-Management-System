import api from "./api";

const productService = {
  getProducts: () => api.get("/products"),

  getProduct: (id) => api.get(`/products/${id}`),

  createProduct: (data) => api.post("/products", data),

  updateProduct: (id, data) =>
    api.put(`/products/${id}`, data),

  deleteProduct: (id) =>
    api.delete(`/products/${id}`),

  exportExcel: () =>
    api.get("/export/products", {
      responseType: "blob",
    }),
};

export default productService;