import Api from "../../network/axiosClients";

export const getAllTrainerApi = async (data) => {
    return Api.get("admin/trainers?env=lms");
};