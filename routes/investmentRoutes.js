const express = require("express");
const { submitInvestment } = require("../controllers/investmentController");
const { getCurrentPrice } = require("../controllers/investmentController");
const { getROIProjection } = require("../controllers/investmentController");
const { competitiveAnalysis } = require("../controllers/investmentController");
const { body, validationResult } = require("express-validator");

const router = express.Router();

router.post(
  "/submit-investment",
  [
    body("investment_amount")
      .isFloat({ min: 100000 }) // minimum 1 lakh
      .withMessage("Investment amount must be a number greater than ₹1,00,000"),
    body("location")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Location is required and must be at least 5 characters")
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage("Location must contain only letters and spaces"),
  ],
  submitInvestment
);
router.get("/get-current-price", getCurrentPrice);
router.get("/roi-projection", getROIProjection);
router.get("/competitive-analysis", competitiveAnalysis);

module.exports = router;
