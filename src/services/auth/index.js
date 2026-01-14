import Api from "../../network/axiosClients";

export const LoginApi = async (data) => {
    return Api.post("auth/login", data);
};
export const SignupApi = async (data) => {
    return Api.post("auth/register", data);
};
export const SendOtp = async (data) => {
    return Api.post("auth/verify-code", data);
};
