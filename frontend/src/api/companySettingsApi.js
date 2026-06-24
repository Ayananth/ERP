import api from "./axios";

export const getCompanySettings = async () => {
  const response = await api.get("/auth/company-settings/");
  return response.data;
};

export const updateCompanySettings = async (formData) => {
  const response = await api.put("/auth/company-settings/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
