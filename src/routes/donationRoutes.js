import express from "express";
import { 
    createDonation, 
    getDonationsByRestaurant, 
    getActiveDonations, 
    updateDonationStatusController 
} from "../controllers/donationController.js";  // Merged imports

const router = express.Router();

//  Route to create a new donation
router.post("/donate", createDonation);

//  Route to get donations by restaurant ID
router.get("/donations/:restaurant_id", getDonationsByRestaurant);

//  Route to get all active donations
router.get("/donations", getActiveDonations);

//  Route to update donation status
router.put("/donations/update", updateDonationStatusController);

export default router;
