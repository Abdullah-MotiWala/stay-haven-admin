import Api from "../../network/axiosClients";

export const getAllRooms = async (
  currentPage = 1,
  itemsPerPage = 10,
  status = "available",
  search = "",
  sort = "asc",
) => {
  // return Api.get(`/rooms?page=${currentPage}&limit=${itemsPerPage}`);
  return Api.get(
    `/rooms?page=${currentPage}&limit=${itemsPerPage}&status=${status ?? "available"}&search=${search ?? ""}&sortByHotel=${sort ?? "asc"}`,
  );
};
export const createRoom = async (data) => {
  return Api.post("rooms", data);
};
export const updateRoom = async (id, data) => {
  return Api.patch(`rooms/${id}`, data);
};
export const getById = async (id, data) => {
  return Api.get(`rooms/${id}`, data);
};
export const deleteRoom = async (id, data) => {
  return Api.delete(`rooms/${id}`, data);
};
export const getStats = async (data) => {
  return Api.get("rooms/stats", data);
};
