import Api from "../../network/axiosClients";

export const getAllFeature = async (type) => {
    return Api.get(`features?type=${type}`);
};
