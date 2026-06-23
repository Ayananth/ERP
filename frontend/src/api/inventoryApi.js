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

export const getItemList = async (search = "") => {
  const response = await api.get("/inventory/items/", {
    params: search ? { search } : undefined,
  });

  return response.data;
};

export const updateItem = async (id, data) => {
  const response = await api.put(`/inventory/items/${id}/`, data);
  return response.data;
};


export const getAvailableUnits = () =>
  api.get("/inventory/units/");

export const getItemUnits = (itemId) =>
  api.get(`/inventory/items/${itemId}/units/`);


export const addItemUnit = (
  itemId,
  data
) =>
  api.post(
    `/inventory/items/${itemId}/units/add/`,
    data
  );


export const deleteItemUnit = (
  itemUnitId
) =>
  api.delete(
    `/inventory/item-units/${itemUnitId}/`
  );

  export const saveItemUnitSettings = (
  itemId,
  data
) => {
  return api.put(
    `/inventory/items/${itemId}/unit-settings/`,
    data
  );
};


// Prices

export const getItemPrices = async (itemId) => {
    const response = await api.get(
        `/inventory/items/${itemId}/prices/`
    );

    return response.data;
};

export const saveItemPrices = async (
    itemId,
    prices
) => {
  console.log(prices)
  console.log(itemId)
    const response = await api.put(
        `/inventory/items/${itemId}/prices/`,
        {
            prices,
        }
    );

    return response.data;
};

export const getItemPhoto = async (itemId) => {
  const response = await api.get(
    `/inventory/items/${itemId}/photo/`
  );

  return response.data;
};

export const uploadItemPhoto = async (
  itemId,
  file
) => {
  const formData = new FormData();

  formData.append("image", file);

  const response = await api.post(
    `/inventory/items/${itemId}/photo/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const deleteItemPhoto = async (
  itemId
) => {
  const response = await api.delete(
    `/inventory/items/${itemId}/photo/`
  );

  return response.data;
};
