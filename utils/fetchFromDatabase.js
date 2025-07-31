// utils/fetchFromDatabase.js
const Data = require("../models/Data");

const fetchPriceFromDatabase = async (location) => {
  const result = await Data.findOne({ location });
  if (!result) {
    return { error: "Location not found in database" };
  }

  return result.toObject(); // return plain JSON
};

module.exports = fetchPriceFromDatabase;
