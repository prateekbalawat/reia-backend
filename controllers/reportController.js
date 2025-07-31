const Report = require("../models/Report");

const nodemailer = require("nodemailer");
const User = require("../models/User");

exports.emailReport = async (req, res) => {
  const { id } = req.params;

  try {
    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ error: "Report not found" });

    // Fetch user info for email
    const user = await User.findById(report.userId);
    if (!user || !user.email)
      return res.status(400).json({ error: "User email not found" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    const emailContent = `
      <h3>📊 ROI Report - ${report.location}</h3>
      <p><strong>Investment:</strong> ₹${report.initial_investment}</p>
      <p><strong>Expected Gain:</strong> ₹${report.expected_5_year_gain}</p>
      <p><strong>CAGR:</strong> ${report.cagr}</p>
      <br/>
      <h4>📈 ROI Projection:</h4>
      <ul>
        ${report.roi_projection
          .map(
            (r) =>
              `<li>Year ${r.year}: ₹${r.estimated_value.toLocaleString()}</li>`
          )
          .join("")}
      </ul>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `ROI Report for ${report.location}`,
      html: emailContent,
    });

    res.json({ message: "Report emailed successfully" });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
};

exports.getReportsByUser = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const reports = await Report.find({ userId }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.saveReport = async (req, res) => {
  const report = req.body.report;

  if (!report) {
    return res.status(400).json({ error: "Missing report data." });
  }

  try {
    const newReport = new Report({
      userId: req.user.id, // comes from authMiddleware
      ...report,
    });

    await newReport.save();
    res.status(201).json({ message: "Report saved successfully." });
  } catch (error) {
    console.error("Error saving report:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.deleteReport = async (req, res) => {
  const reportId = req.params.id;

  try {
    const report = await Report.findOne({ _id: reportId, userId: req.user.id });

    if (!report) {
      return res
        .status(404)
        .json({ error: "Report not found or unauthorized" });
    }

    await Report.deleteOne({ _id: reportId });
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ error: "Server error while deleting report" });
  }
};
