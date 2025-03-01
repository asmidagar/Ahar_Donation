import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {pool} from "../config/db.js"; // ✅ Correct

const router = express.Router();

// Restaurant Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const [results] = await pool.query("SELECT * FROM restaurants WHERE email = ?", [email]);
        
        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const restaurant = results[0];
        const isMatch = await bcrypt.compare(password, restaurant.password);
        
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: restaurant.id, role: "restaurant" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Send response with redirect URL
        res.json({ 
            message: "Login successful", 
            token, 
            restaurantId: restaurant.id, 
            redirectTo: "/delivery-agent" // Redirect URL for frontend
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
