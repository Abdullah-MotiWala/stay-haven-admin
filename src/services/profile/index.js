import Api from "../../network/axiosClients";

export const updateProfile = async (data) => {
    return Api.put("users/me", data);
};

export const getProfile = async () => {
    return Api.get("users/me");
};
