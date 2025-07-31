const NodeCache = require("node-cache");
const { calculateROI } = require("../services/roiService");
const fetchPriceFromDatabase = require("../utils/fetchFromDatabase");
const { runCompetitiveAnalysis } = require("../services/analysisService"); // or analysisService
const { validationResult } = require("express-validator");

const roiByArea = {
  Whitefield: 0.06,
  "JP Nagar": 0.045,
  "BTM Layout": 0.05,
  "MG Road": 0.04,
  Indiranagar: 0.047,
  "Electronic City": 0.055,
  Devanahalli: 0.065,
  "KR Puram": 0.058,
  Vidyaranyapura: 0.043,
  "HSR Layout": 0.05,
};

const cache = new NodeCache({ stdTTL: 3600 }); // Cache expires in 1 hour (3600 sec)

const submitInvestment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { investment_amount, location } = req.body;

  if (!investment_amount || !location) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const cacheKey = `${location}_${investment_amount}`;

  // ✅ 1. Return from cache if exists
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    // 2. Perform actual scraping and ROI computation
    const scraperResult = await fetchPriceFromDatabase(location);
    console.log("Scraper result", scraperResult);

    if (scraperResult.error) {
      return res.status(500).json({ error: scraperResult.error });
    }

    const {
      current_price_per_sqft,
      property_type,
      nearby_properties,
      rental_yield_percent = 3.0,
    } = scraperResult;

    const average_property_size_sqft = Math.round(
      investment_amount / current_price_per_sqft
    );

    const annual_rate =
      roiByArea[location.replace(/\s*Bangalore$/i, "").trim()] || 0.05; // fallback to 5%
    const roi_projection = calculateROI(investment_amount, annual_rate);
    const expected_5_year_gain =
      roi_projection[roi_projection.length - 1].estimated_value -
      investment_amount;

    const finalValue =
      roi_projection[roi_projection.length - 1].estimated_value;
    const cagr = ((finalValue / investment_amount) ** (1 / 5) - 1) * 100;

    const response = {
      location,
      current_price_per_sqft,
      property_type,
      average_property_size_sqft,
      nearby_properties,
      roi_projection,
      expected_5_year_gain: Math.round(expected_5_year_gain),
      cagr: `${(annual_rate * 100).toFixed(2)}%`,
    };

    // ✅ 3. Save to cache
    cache.set(cacheKey, response);

    return res.json(response);
  } catch (err) {
    console.error("Error in submitInvestment:", err.message);
    return res.status(500).json({ error: "Failed to process investment" });
  }
};

const getCurrentPrice = async (req, res) => {
  const { location } = req.query;

  if (!location) {
    return res.status(400).json({ error: "Location is required" });
  }

  try {
    const result = await fetchPriceFromDatabase(location);
    return res.json(result);
  } catch (err) {
    console.error("Scraper error:", err.message);
    return res.status(500).json({ error: "Failed to fetch data from scraper" });
  }
};

const getROIProjection = (req, res) => {
  const { investment, rate } = req.query;

  if (!investment || !rate) {
    return res.status(400).json({ error: "Investment and rate are required" });
  }

  const roi_projection = calculateROI(Number(investment), Number(rate));
  const expected_5_year_gain =
    roi_projection[roi_projection.length - 1].estimated_value -
    Number(investment);

  return res.json({
    roi_projection,
    expected_5_year_gain,
    cagr: `${rate}%`,
  });
};

const competitiveAnalysis = async (req, res) => {
  try {
    const { location } = req.query;
    if (!location) {
      return res.status(400).json({ error: "Location is required" });
    }

    const result = await runCompetitiveAnalysis(location);
    res.json(result);
  } catch (err) {
    console.error("Error in /competitive-analysis:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  submitInvestment,
  getCurrentPrice,
  getROIProjection,
  competitiveAnalysis,
};
