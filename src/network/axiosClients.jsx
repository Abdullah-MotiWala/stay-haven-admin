import axios from "axios";
import { openNotification } from "./notification";
import { store } from "../redux/store";
import { FinishLoading, TotalRequest } from "../redux/features/loader";
import { setupCache } from "axios-cache-interceptor";

const Status = {
  CREATED: 201,
  SUCCESS: 200,
  NOTACCEPTABLEEXCEPTION: 406,
};

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://api.stayhaven.pk/api/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const Api = setupCache(axiosInstance, {
  methods: [],
  headerInterpreter: () => null,
});

// Api.interceptors.request.use(
//   async config => {
//     await store?.dispatch(TotalRequest());
//     config.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
//     return config;
//   },
//   async error => {
//     await store?.dispatch(FinishLoading());
//     return Promise.reject(error);
//   }
// );

Api.interceptors.request.use(
  async (config) => {
    await store?.dispatch(TotalRequest());

    let token = localStorage.getItem("token");

    if (!token) {
      const persistRoot = JSON.parse(
        localStorage.getItem("persist:root") || "{}",
      );
      const userState = JSON.parse(persistRoot.user || "{}");
      token = userState?.token;
      token = userState?.token;
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  async (error) => {
    await store?.dispatch(FinishLoading());
    return Promise.reject(error);
  },
);

Api.interceptors.response.use(
  async (response) => {
    await store?.dispatch(FinishLoading());
    const { meta } = response.data;
    if (
      meta?.statusCode == Status.CREATED ||
      meta?.statusCode == Status.SUCCESS
    ) {
      response.data.success = true;
    }
    return response;
  },
  async (error) => {
    const res = error?.response;
    const AUTH_DISABLED_NOTIFICATION_ENDPOINTS = [
      "users/me",
      "users/verify-hash",
    ];
    await store?.dispatch(FinishLoading());

    let message =
      res?.data?.error || res?.data?.meta?.message || res?.meta?.error;
    if (Array.isArray(res?.data?.meta?.message)) {
      message = res.data.meta.message[0];
    }

    if (
      !(
        window.location.href.includes("auth") &&
        AUTH_DISABLED_NOTIFICATION_ENDPOINTS.some((endpoint) =>
          res?.request?.responseURL?.includes(endpoint),
        )
      )
    ) {
      // openNotification("error", message);
    }

    res.data = { ...res.data, success: false };

    if (res?.status === 401 && !window.location.href.includes("auth")) {
      localStorage.clear();
      window.location.href = "/auth/login";
    } else if (res?.status === 410) {
      window.location.href = "/admin/dashboard";
    }

    return res;
  },
);

export default Api;
