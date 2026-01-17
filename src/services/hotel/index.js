import Api from "../../network/axiosClients";

export const getAllHotels = async () => {
    return Api.get("/hotels"); 
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

export const deleteHotel = async (id) => {
    return Api.delete(`/hotels/${id}`);
};