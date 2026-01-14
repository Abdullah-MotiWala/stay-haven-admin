import Api from "../../network/axiosClients";

export const getAllPolicy = async (id) => {
    return Api.get(`policy`);
};