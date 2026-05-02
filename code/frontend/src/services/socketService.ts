import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

let socket: Socket | null = null;

export const initSocket = () => {
    if (!socket) {
        socket = io(SOCKET_URL, {
            withCredentials: true,
            transports: ["websocket"]
        });
    }
    return socket;
};

export const getSocket = () => {
    if (!socket) return initSocket();
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
