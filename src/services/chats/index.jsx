import Api from "../../network/axiosClients";

export const getAllUsers = async (id) => {
    return Api.get(`lms/firebase/users?currentUserId=${id}`);
};

export const getAllChatByUsers = async (id) => {
    return Api.get(`lms/firebase/chat/user/${id}`);
};
export const getAllChatMessages = async (id) => {
    return Api.get(`lms/firebase/chat/${id}/messages`);
};
export const createChat = async (payload) => {
    return Api.post("lms/firebase/chat", payload);
};

export const postMessage = async (chatID , payload) => {
    return Api.post(`lms/firebase/chat/${chatID}/messages`, payload);
};