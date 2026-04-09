import Api from "../../network/axiosClients";

export const getAllHotels = async (currentPage, itemsPerPage, hostId = null) => {
  const params = `page=${currentPage}&limit=${itemsPerPage}${hostId ? `&hostId=${hostId}` : ""}`;
  return Api.get(`/hotels?${params}`);
};

export const getHotelsList = async (currentPage, itemsPerPage) => {
  return Api.get(`/hotels/list?page=${currentPage}&limit=${itemsPerPage}`);
};

export const getHotelNamesList = async (currentPage, itemsPerPage) => {
  return Api.get("/hotels/list");
};

export const lastHotelId = async () => {
  return Api.get("/hotels/next-id");
};

export const getAllHotelsStatistics = async (id) => {
  return Api.get(`/hotels/dashboard?hotelId=${id}`);
};

export const getHotelById = async (id) => {
  return Api.get(`/hotels/${id}`);
};

export const createHotel = async (hotelData) => {
  return Api.post("/hotels", hotelData);
};

export const updateHotel = async (id, updatedData) => {
  return Api.put(`/hotels/${id}`, updatedData);
};
export const bulkActionApi = async (data) => {
  return Api.patch(`hotels/bulk-action`, data);
};

export const deleteHotel = async (id) => {
  return Api.delete(`/hotels/${id}`);
};
export const hotelStatusUpdate = async (id,data) => {
  return Api.patch(`/hotels/${id}/status`,data);
};

export const getStats = async (data) => {
    return Api.get("hotels/stats", data);
};
