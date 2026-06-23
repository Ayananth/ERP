import api from "./axios";

export const getCustomerDropdown = async () => {
  const response = await api.get("/customers/");
  return response.data;
};

export const getItemSearch = async (search = "") => {
  const response = await api.get("/inventory/items/", {
    params: search ? { search } : undefined,
  });

  return response.data;
};

export const getItemDetails = async (id) => {
  const response = await api.get(`/inventory/items/${id}/`);
  return response.data;
};

export const createQuotation = async (body) => {
  const response = await api.post("/sales/quotations/create/", body);
  return response.data;
};

export const getQuotationList = async () => {
  const response = await api.get("/sales/quotations/");
  return response.data;
};

export const getQuotation = async (id) => {
  const response = await api.get(`/sales/quotations/${id}/`);
  return response.data;
};

export const updateQuotation = async (id, body) => {
  const response = await api.put(`/sales/quotations/${id}/`, body);
  return response.data;
};

export const deleteQuotation = async (id) => {
  const response = await api.delete(`/sales/quotations/${id}/`);
  return response.data;
};

export const createSalesOrder = async (body) => {
  const response = await api.post("/sales/orders/create/", body);
  return response.data;
};

export const getSalesOrderList = async () => {
  const response = await api.get("/sales/orders/");
  return response.data;
};

export const getSalesOrder = async (id) => {
  const response = await api.get(`/sales/orders/${id}/`);
  return response.data;
};

export const updateSalesOrder = async (id, body) => {
  const response = await api.put(`/sales/orders/${id}/`, body);
  return response.data;
};

export const deleteSalesOrder = async (id) => {
  const response = await api.delete(`/sales/orders/${id}/`);
  return response.data;
};
