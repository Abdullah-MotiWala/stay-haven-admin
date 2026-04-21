import Api from "../../network/axiosClients";

export const getSettingsApi = () => {
    return Api.get("/settings"); 
};

export const updateSettingsApi = (payload) => {
    return Api.patch("/settings", payload); 
};

export const getFeaturesByTypeApi = (type) => {
    return Api.get(`/features?type=${type}`);
};

export const createFeatureApi = (payload) => {
    return Api.post("/features", payload); 
};

export const deleteFeatureApi = (id) => {
    return Api.delete(`/features/${id}`);
};

export const updateFeatureApi = (id, payload) => {
    return Api.put(`/features/${id}`, payload);
};