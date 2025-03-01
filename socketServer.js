import http from "http";
import app from "./app.js";
import { initializeSocket } from "./config/socket.js";

const server = http.createServer(app);
initializeSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
