import Api from "../../network/axiosClients";

export const getAllBooking = async (page = 1, limit = 10, isApartment) => {
    return Api.get("bookings", { params: { page, limit, isApartment } });
};
export const createBooking = async (data) => {
    return Api.post("bookings", data);
};
export const updateBooking = async (id, data) => {
    return Api.patch(`bookings/${id}`, data);
};
export const getById = async (id, data) => {
    return Api.get(`bookings/${id}`, data);
};
export const getStats = async (data) => {
    return Api.get("bookings/stats", data);
};
export const updateStats = async (id,data) => {
    return Api.patch(`bookings/${id}/status`, data);
};
export const getRecentBooking = async (data) => {
    return Api.get("/bookings/recent", data);
};
export const deleteBooking = async (id) => {
    return Api.delete(`bookings/${id}`);
};

export const getBookedDates = async (params) => {
    return Api.get("bookings/booked-dates", { params });
};