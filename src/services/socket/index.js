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

// autoConnect: false - manually connect karenge taake token ready ho
const socket = io("http://localhost:3000", {
// const socket = io("https://api.stayhaven.pk", {
    auth: (cb) => cb({ token: getToken() }),
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

socket.on("connect", () => {
    console.log("[SOCKET] Connected:", socket.id);
});

socket.on("connect_error", (err) => {
    console.error("[SOCKET] connect_error:", err.message);
});

export default socket;
