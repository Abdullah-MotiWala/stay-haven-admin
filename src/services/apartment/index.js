import Api from "../../network/axiosClients";

export const getAllApartment = async (data) => {
    return Api.get("apartments", data);
};