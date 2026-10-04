const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const topologyRoutes = require("./routes/topologyRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

const PORT =
  process.env.PORT || 5001;

connectDB();

app.use(cors());

app.use(express.json());


// =====================================================
// ROUTES
// =====================================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/topologies",
  topologyRoutes
);


// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "NetViz Backend is running",
  });
});


app.listen(PORT, () => {
  console.log(
    `NetViz server running on http://localhost:${PORT}`
  );
});