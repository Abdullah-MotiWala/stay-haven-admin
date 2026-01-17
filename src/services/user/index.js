import Api from "../../network/axiosClients";

export const getAllUsers = async (data) => {
    return Api.get("hotels", data);
};
export const getUserById = async (data) => {
    return Api.get("hotels/:id", data);
};
export const createUser = async (data) => {
    return Api.post("users", data);
};
export const updateUser = async (data) => {
    return Api.put("users/:id", data);
};
export const deleteUser = async (data) => {
    return Api.delete("users/:id", data);
};