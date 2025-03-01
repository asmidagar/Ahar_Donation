import { Server } from "socket.io";

let io;

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: { origin: "*" }
    });

    io.on("connection", (socket) => {
        console.log("Delivery agent connected");

        socket.on("statusChange", (donationId) => {
            io.emit("updateList", { donationId });
        });

        socket.on("disconnect", () => console.log("Delivery agent disconnected"));
    });
};

export const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
};