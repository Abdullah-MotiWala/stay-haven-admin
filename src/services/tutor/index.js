import Api from "../../network/axiosClients";

export const getAllTutorApi = async (name) => {
    return Api.get(`user/tutor/all?name=${name}`);
};
export const getTutorById = async (id) => {
    return Api.get(`user/tutor/${id}`);
};