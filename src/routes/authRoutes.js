import express from "express";
import { register, login, getUserFromToken } from "../controllers/authController.js";
import {query} from "../config/db.js"; // Your database connection
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register-user", register);
router.post("/login-user", login);
router.get("/getUserData", getUserFromToken);

// Restaurant Login Route
router.post("/restaurant-login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const [restaurant] = await query("SELECT * FROM restaurants WHERE email = ?", [email]);

        if (restaurant.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Validate password (use bcrypt if hashed)
        if (restaurant[0].password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Create a new delivery entry
        const [delivery] = await query("INSERT INTO Delivery (restaurant_id, status) VALUES (?, 'Food Ready for Pickup')", [restaurant[0].id]);

        // Generate JWT token for authentication
        const token = jwt.sign({ restaurantId: restaurant[0].id }, "your_secret_key", { expiresIn: "1h" });

        res.json({ token, redirectUrl: "/delivery-agent", deliveryId: delivery.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
