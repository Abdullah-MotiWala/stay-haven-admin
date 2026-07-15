import Api from "../../network/axiosClients";


// export const addDispute = (
//   token: string,
//   payload: {}
// ): Promise<AxiosResponse> => {
//   return Api.post(`lms/dispute`, payload, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//   });
// };


export const addDisputeApi = async (data) => {
    return Api.post(`lms/dispute`, data);
};