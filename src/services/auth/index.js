import Api from "../../network/axiosClients";

export const loginApi = async (data) => {
    return Api.post("auth/login", data);
};
export const signupApi = async (data) => {
    return Api.post("auth/signup", data);
};
export const changePasswordApi = async (data) => {
    return Api.post("auth/change-password", data);
}