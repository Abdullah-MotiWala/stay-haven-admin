import Api from "../../network/axiosClients";

export const updateProfile = async (data) => {
    return Api.put("user/me", data);
};

export const getProfile = async () => {
    return Api.get("user/me");
};