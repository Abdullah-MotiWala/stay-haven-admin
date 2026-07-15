import Api from "../../network/axiosClients";

export const getAllbadgesByUser = async (id) => {
    return Api.get(`lms/batch/all/user/${id}`);
};