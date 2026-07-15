import Api from "../../network/axiosClients";

export const getAllApartments = async (
  currentPage = 1,
  itemsPerPage = 10,
  status = "",
  search = "",
  sort = "asc",
  activeType = "All",
  hostId = null,
  isAdmin = false,
) => {
  const hostParam = hostId ? `&hostId=${hostId}` : "";
  const adminParam = isAdmin ? `&adminPanel=true` : ""; 
  return Api.get(
    `/apartments?page=${currentPage}&limit=${itemsPerPage}&status=${status ?? ""}&search=${search ?? ""}&sortByHotel=${sort ?? "asc"}&type=${activeType}${hostParam}${adminParam}`,
  );
};
export const createAppartment = async (data) => {
  return Api.post("apartments", data);
};
export const getBedType = async (id) => {
  return Api.get(`apartments/by-type/${id}`);
};
export const updateAppartment = async (id, data) => {
  return Api.patch(`apartments/${id}`, data);
};
export const getById = async (id, data) => {
  return Api.get(`apartments/${id}`, data);
};
export const deleteAppartment = async (id, data) => {
  return Api.delete(`apartments/${id}`, data);
};
export const getStats = async (data) => {
  return Api.get("apartments/stats", data);
};
export const updateApartmentStatus = async (id, status, reason = "") => {
  return Api.patch(`apartments/${id}/status`, { status, ...(reason ? { reason } : {}) });
};
