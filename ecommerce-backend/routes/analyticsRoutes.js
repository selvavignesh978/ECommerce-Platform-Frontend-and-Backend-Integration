const express = require("express");
const { getProductRecommendations, getPersonalizedRecommendations } = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/recommendations/for-me", protect, getPersonalizedRecommendations);
router.get("/recommendations/:productId", getProductRecommendations);

module.exports = router;
