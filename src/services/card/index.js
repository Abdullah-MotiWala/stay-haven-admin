import Api from "../../network/axiosClients";

export const createWallet = async (data) => {
    return Api.post("wallet", data);
};
export const getAllTransaction = async () => {
    return Api.get("wallet/transaction-history");
};
export const getAllCards = async () => {
    return Api.get("wallet");
};
export const getCardBalance = async () => {
    return Api.get("wallet/balance");
};