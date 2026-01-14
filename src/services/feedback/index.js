import Api from "../../network/axiosClients";

export const createFeedback = async (data) => {
    return Api.post("lms/feedback", data);
};
export const getCourseFeedback = async (id, filterrating, search) => {
    return Api.get(`lms/feedback/all?courseId=${id}&courseRating=${filterrating}&name=${search}`);
};