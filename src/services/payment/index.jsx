import Api from "../../network/axiosClients";

export const createPayment = async (data) => {
    return Api.post(`lms/myCourse/enroll`, data);
};