import Api from "../../network/axiosClients";

export const getNotificationApi = () => {
    return Api.get("/notifications"); 
};

