import Api from "../../network/axiosClients";

export const getAllFaqs = async (id) => {
    return Api.get(`faq`);
};