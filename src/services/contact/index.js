import Api from "../../network/axiosClients";

export const contact = async (data) => {
    return Api.post("inquiry", data);
};