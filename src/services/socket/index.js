import { io } from "socket.io-client";

export const getToken = () => {
    try {
        const token = localStorage.getItem("token");
        if (token) return token;
        const persistRoot = JSON.parse(localStorage.getItem("persist:root") || "{}");
        const userState = JSON.parse(persistRoot.user || "{}");
        return userState?.token || null;
    } catch {
        return null;
    }
};

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "https://api.stayhaven.pk";

const socket = io(SOCKET_URL, {
    auth: (cb) => cb({ token: getToken() }),
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ["websocket", "polling"],
});

socket.on("connect", () => {
});

socket.on("connect_error", (err) => {
    console.error("[SOCKET] connect_error:", err.message);
});

export default socket;
