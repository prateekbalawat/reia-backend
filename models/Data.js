// models/PriceData.js
const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema({
  location: String,
  current_price_per_sqft: Number,
  property_type: String,
  rental_yield_percent: Number,
  nearby_properties: [
    {
      name: String,
      price_per_sqft: Number,
    },
  ],
});

module.exports = mongoose.model("Data", DataSchema, "data");
