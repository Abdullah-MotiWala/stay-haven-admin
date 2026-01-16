import Api from "../../network/axiosClients";

export const getAllFeature = async (data) => {
    return Api.get("features", data);
};
