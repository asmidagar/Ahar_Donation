import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(403).json({ message: "Access denied" });

    jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" });
        req.restaurantId = decoded.id;
        next();
    });
};

// Create Donation Request (Only Restaurants)
router.post("/create", verifyToken, async (req, res) => {
    const { food_details, quantity } = req.body;
    const sql = "INSERT INTO donations (restaurant_id, food_details, quantity, status, created_at) VALUES (?, ?, ?, 'Pending', NOW())";

    try {
        await query(sql, [req.restaurantId, food_details, quantity]);
        res.status(201).json({ message: "Donation request created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error creating donation" });
    }
});

// Get Pending Donations (For Delivery Agents)
router.get("/pending", async (req, res) => {
    try {
        const donations = await query("SELECT * FROM donations WHERE status = 'Pending'");
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching donations" });
    }
});

// Accept Donation (Delivery Agent)
router.post("/accept/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await query("UPDATE donations SET status = 'Food Ready for Pickup' WHERE id = ?", [id]);
        res.json({ message: "Donation accepted by delivery agent" });
    } catch (error) {
        res.status(500).json({ message: "Error updating donation status" });
    }
});

// Update Donation Status (Picked Up, Delivered)
router.post("/update-status/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // Expected values: "Picked Up", "Delivered"

    if (!["Picked Up", "Delivered"].includes(status)) {
        return res.status(400).json({ message: "Invalid status update" });
    }

    try {
        await query("UPDATE donations SET status = ? WHERE id = ?", [status, id]);
        res.json({ message: `Donation status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ message: "Error updating donation status" });
    }
});

export default router;
