import Api from "../../network/axiosClients";

export const CreateQuizApi = async (data) => {
    return Api.post("lms/quiz", data);
};
export const getQuizByIdApi = async (id) => {
    return Api.get(`lms/quiz/${id}`);
};

export const getAllQuizBycourseIdApi = async (id) => {
    return Api.get(`lms/quiz/all?courseId=${id}`);
}

export const postQuilDetails = async (id, payload) => {
    return Api.post(`lms/quiz/${id}/submit-result`, payload);
}
