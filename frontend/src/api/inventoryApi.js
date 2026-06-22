import api from "./axios";

export const getItemDropdowns = async () => {
  const response = await api.get(
    "/inventory/item-dropdowns/"
  );

  return response.data;
};


export const createItem = async (data) => {
  const response = await api.post(
    "/inventory/items/",
    data
  );

  return response.data;
};


export const getItem = async (id) => {
  const response = await api.get(`/inventory/items/${id}`);
  return response.data;
};


export const getAvailableUnits = () =>
  api.get("/inventory/units/");

export const getItemUnits = (itemId) =>
  api.get(`/inventory/items/${itemId}/units/`);