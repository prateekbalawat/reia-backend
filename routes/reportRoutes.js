// routes/reportRoutes.js

const express = require("express");
const router = express.Router();
const {
  saveReport,
  getReportsByUser,
  deleteReport,
  emailReport,
} = require("../controllers/reportController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/save-report", authMiddleware, saveReport);
router.get("/my-reports", authMiddleware, getReportsByUser);
router.delete("/reports/:id", authMiddleware, deleteReport);
router.post("/reports/:id/email", authMiddleware, emailReport);

module.exports = router;
