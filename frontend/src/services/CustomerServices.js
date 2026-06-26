import api from "./api";

const customerService = {
  // Get all customers
  getCustomers: () =>
    api.get("/customers"),

  // Get customer by id
  getCustomer: (id) =>
    api.get(`/customers/${id}`),

  // Create customer
  createCustomer: (data) =>
    api.post("/customers", data),

  // Update customer
  updateCustomer: (id, data) =>
    api.put(`/customers/${id}`, data),

  // Delete customer
  deleteCustomer: (id) =>
    api.delete(`/customers/${id}`),
};

export default customerService;