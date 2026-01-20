import Api from "../../network/axiosClients";

export const getAllBooking = async (data) => {
    return Api.get("bookings", data);
};
export const createBooking = async (data) => {
    return Api.post("bookings", data);
};
export const updateBooking = async (id, data) => {
    return Api.patch(`bookings/${id}`, data);
};
export const getStats = async (data) => {
    return Api.get("bookings/stats", data);
};

export const getRecentBooking = async (data) => {
    return Api.get("/bookings/recent", data);
};


