import Api from "../../network/axiosClients";

export const getAllUsers = async (params) => {
    return Api.get("users", { params });
};
export const getUserById = async (id) => {
    return Api.get(`users/${id}`);
};
export const createUser = async (data) => {
    return Api.post("users", data);
};
export const updateUser = async (id, data) => {
    return Api.put(`users/${id}`, data);
};
export const deleteUser = async (id) => {
    return Api.delete(`users/${id}`);
};

export const toggleUserStatus = async (id, reason = "") => {
    return Api.put(`users/${id}/status`, reason ? { reason } : {});
};
