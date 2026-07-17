import Api from "../../network/axiosClients";

export const getSocialLinks = () => Api.get("/social-links");
export const createSocialLink = (data) => Api.post("/social-links", data);
export const updateSocialLink = (id, data) => Api.patch(`/social-links/${id}`, data);
export const deleteSocialLink = (id) => Api.delete(`/social-links/${id}`);
