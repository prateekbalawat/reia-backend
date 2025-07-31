// models/Report.js

const mongoose = require("mongoose");

const ROISchema = new mongoose.Schema({
  year: Number,
  estimated_value: Number,
});

const ReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    current_price_per_sqft: {
      type: Number,
      required: true,
    },
    property_type: {
      type: String,
      required: true,
    },
    average_property_size_sqft: {
      type: Number,
      required: true,
    },
    expected_5_year_gain: {
      type: Number,
      required: true,
    },
    initial_investment: {
      type: Number,
      required: true,
    },
    cagr: {
      type: String,
      required: true,
    },
    roi_projection: [ROISchema],
    nearby_properties: [
      {
        name: String,
        price_per_sqft: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Report", ReportSchema);
