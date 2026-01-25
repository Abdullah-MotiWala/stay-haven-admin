import Api from "../../network/axiosClients";

export   const getAdminId = () => {
    try {
        const persistRoot = JSON.parse(localStorage.getItem("persist:root"));
        if (!persistRoot || !persistRoot.user) return null;
        const userState = JSON.parse(persistRoot.user);
        return userState?.selfUser?.id || userState?.user?.id || "49d60174-5bb1-400c-9591-42536508e0e8"; 
    } catch (err) {
        return "49d60174-5bb1-400c-9591-42536508e0e8"; 
    }
};

export const createMessages = async (data) => {
  return Api.post("messages", data);
};

export const getMessages = async (id) => {
  return Api.get(`tickets/${id}/messages`);
};

export const getTicket = async (id) => {
  return Api.get(`tickets/${id}`);
};
