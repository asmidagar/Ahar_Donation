import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http"; // Import http for WebSocket
import { checkConnection} from "./src/config/db.js"; // ✅ Correct named imports
import { creatTable } from "./src/utils/dbUtils.js"; 
import { initializeSocket } from "./src/config/socket.js"; // WebSocket for real-time updates
import { Server } from "socket.io";

// Import Routes
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import donationRoutes from "./src/routes/donationRoutes.js";
import deliveryRoutes from "./src/routes/deliveryRoutes.js";
import restaurantRoutes from "./src/routes/restaurantRoutes.js";

dotenv.config();
const app = express();
const server = http.createServer(app); // Create HTTP server for WebSocket
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Adjust based on your frontend URL
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON requests

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/delivery-auth", deliveryRoutes);

// Start Server
const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);

    try {
        await checkConnection(); // ✅ Check database connection correctly
        await creatTable(); // Initialize tables if not exists
        initializeSocket(server); // Initialize WebSocket
    } catch (error) {
        console.error("❌ Failed to initialize the database:", error);
    }
});
