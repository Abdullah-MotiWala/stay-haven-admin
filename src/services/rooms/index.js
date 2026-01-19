import Api from "../../network/axiosClients";

export const getAllRooms = async (data) => {
    return Api.get("rooms", data);
};
export const createRoom = async (data) => {
    return Api.post("rooms", data);
};
export const updateRoom = async (id, data) => {
    return Api.patch(`rooms/${id}`, data);
};
export const deleteRoom = async (id, data) => {
    return Api.delete(`rooms/${id}`, data);
};
export const getStats = async (data) => {
    return Api.get("rooms/stats", data);
};

