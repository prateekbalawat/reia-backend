const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const investmentRoutes = require("./routes/investmentRoutes");
const reportRoutes = require("./routes/reportRoutes");
const authRoutes = require("./routes/authRoutes");

const connectDB = require("./config/db"); // import DB connection

dotenv.config(); // load .env variables

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api", investmentRoutes);
app.use("/api", reportRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
