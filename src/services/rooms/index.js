import Api from "../../network/axiosClients";

export const getAllRooms = async (
  currentPage = 1,
  itemsPerPage = 10,
  status = "",
  search = "",
  sort = "asc",
  activeType = "All Rooms",
  hostId = null,
  isAdmin = false
) => {
  const hostParam = hostId ? `&hostId=${hostId}` : "";
  const adminParam = isAdmin ? `&adminPanel=true` : "";
  return Api.get(
    `/rooms?page=${currentPage}&limit=${itemsPerPage}&status=${status ?? ""}&search=${search ?? ""}&sortByHotel=${sort ?? "asc"}&type=${activeType}${hostParam}${adminParam}`,
  );
};

export const getAllHostels = async (
  currentPage = 1,
  itemsPerPage = 10,
  status = "",
  search = "",
  sort = "asc",
  hostId = null,
) => {
  const hostParam = hostId ? `&hostId=${hostId}` : "";
  return Api.get(
    `/rooms?page=${currentPage}&limit=${itemsPerPage}&isHostel=true&status=${status ?? ""}&search=${search ?? ""}&sortByHotel=${sort ?? "asc"}${hostParam}`,
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
export const getBedtypeId = async (id) => {
  return Api.get(`rooms/by-type/${id}`);
};
export const deleteRoom = async (id, data) => {
  return Api.delete(`rooms/${id}`, data);
};
// export const getStats = async (data) => {
//   return Api.get("rooms/stats", data);
// };

export const getStats = async (isHostel) => {
  const param = isHostel !== undefined ? `?isHostel=${isHostel}` : "";
  return Api.get(`rooms/stats${param}`);
};
export const updateRoomStatus = async (id, status, reason = "") => {
  return Api.patch(`rooms/${id}/status`, { status, ...(reason ? { reason } : {}) });
};
