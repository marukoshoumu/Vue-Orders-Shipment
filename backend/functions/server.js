require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const customerRoutes = require("./routes/customerRoutes");
const shippingRoutes = require("./routes/shippingRoutes");

app.use("/api/customers", customerRoutes);
app.use("/api/shipping", shippingRoutes);
