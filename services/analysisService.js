const fetchPriceFromDatabase = require("../utils/fetchFromDatabase");

const runCompetitiveAnalysis = async (location) => {
  const data = await fetchPriceFromDatabase(location);

  if (!data.nearby_properties || data.nearby_properties.length === 0) {
    return {
      message: "No data available for competitive analysis.",
      comparison: [],
    };
  }

  const prices = data.nearby_properties.map((p) => p.price_per_sqft);

  return {
    location: data.location,
    min_price: Math.min(...prices),
    max_price: Math.max(...prices),
    average_price: Math.round(
      prices.reduce((sum, p) => sum + p, 0) / prices.length
    ),
    count: prices.length,
    properties: data.nearby_properties,
  };
};

module.exports = {
  runCompetitiveAnalysis,
};
