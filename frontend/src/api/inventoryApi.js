import api from "./axios";

export const getItemDropdowns = async () => {
  const response = await api.get(
    "/inventory/item-dropdowns/"
  );

  return response.data;
};