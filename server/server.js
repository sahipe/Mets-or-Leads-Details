import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import XLSX from "xlsx";

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://formservices10:orCFD0tIt4zjfMD3@cluster0.8wlv5xx.mongodb.net/formsDb"
  )
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Schema (Updated for new fields)
const metsOrLeadsSchema = new mongoose.Schema({
  dateTime: Date, // visiting date & time
  name: String,
  eCode: String,
  customerName: String,
  dob: Date,
  contactNo: String,
  force: String,
  bn: String,
  comp: String,
  plan: String,
  premium: Number,
  clientNeeds: String,
  clientRemark: String,
  yourRemark: String,
  customerImage: String,
  latitude: Number,
  longitude: Number,
});

const MetsOrLeads = mongoose.model("Mets_or_Leads", metsOrLeadsSchema);

// POST - Save record
app.post("/api/customers", async (req, res) => {
  try {
    const data = req.body;

    // Convert dates
    if (data.dateTime) {
      data.dateTime = new Date(data.dateTime);
    }
    if (data.dob) {
      data.dob = new Date(data.dob);
    }

    const newRecord = new MetsOrLeads(data);
    await newRecord.save();

    res.status(201).json({ message: "Record saved successfully" });
  } catch (err) {
    console.error("❌ Save error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET - Download Excel with optional filters
app.get("/api/customers/excel", async (req, res) => {
  try {
    const { startDate, endDate, name } = req.query;
    const filter = {};

    if (startDate || endDate) {
      filter.dateTime = {};
      if (startDate) filter.dateTime.$gte = new Date(startDate);
      if (endDate) filter.dateTime.$lte = new Date(endDate);
    }

    if (name) {
      filter.name = new RegExp(name, "i");
    }

    const records = await MetsOrLeads.find(filter).lean();
    if (!records.length) {
      return res
        .status(404)
        .json({ message: "No data found for given filters" });
    }

    const formattedData = records.map((c) => ({
      Date: c.dateTime ? new Date(c.dateTime).toLocaleString() : "",
      Name: c.name,
      "ETC Code": c.eCode,
      "Customer Name": c.customerName,
      DOB: c.dob ? new Date(c.dob).toLocaleDateString() : "",
      "Contact No": c.contactNo,
      Force: c.force,
      BN: c.bn,
      Comp: c.comp,
      Plan: c.plan,
      Premium: c.premium,
      "Clients Needs/Requirements": c.clientNeeds,
      "Clients Remark": c.clientRemark,
      "Your Remarks": c.yourRemark,
      "Customer Image": c.customerImage,
      Latitude: c.latitude,
      Longitude: c.longitude,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Auto column width
    worksheet["!cols"] = Object.keys(formattedData[0]).map((key) => ({
      wch:
        Math.max(
          key.length,
          ...formattedData.map((row) =>
            row[key] ? row[key].toString().length : 0
          )
        ) + 2,
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Mets_or_Leads");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=mets_or_leads.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(excelBuffer);
  } catch (err) {
    console.error("❌ Excel error:", err);
    res.status(500).json({ message: "Error generating Excel" });
  }
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
