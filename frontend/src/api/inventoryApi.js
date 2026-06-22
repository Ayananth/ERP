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