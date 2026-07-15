import Api from "../../network/axiosClients";

export   const getAdminId = () => {
    try {
        const persistRoot = JSON.parse(localStorage.getItem("persist:root"));
        if (!persistRoot || !persistRoot.user) return null;
        const userState = JSON.parse(persistRoot.user);
        return userState?.selfUser?.id || userState?.user?.id 
    } catch (err) {
        return "49d60174-5bb1-400c-9591-42536508e0e8"; 
    }
};

export const getLoggedInUser = () => {
    try {
        const persistRoot = localStorage.getItem("persist:root");
        if (!persistRoot) return null;

        const rootParsed = JSON.parse(persistRoot);
        const userState = JSON.parse(rootParsed.user);
        
        if (userState.login && userState.selfUser && userState.selfUser.id !== "") {
            return {
                id: userState.selfUser.id,
                userType: userState.selfUser.userType?.key || "admin",
                name: userState.selfUser.name
            };
        }
        return null; 
    } catch (err) {
        return null;
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

export const updateTicketStatus = async (id, status) => {
  return Api.patch(`tickets/${id}/status`, { status });
};