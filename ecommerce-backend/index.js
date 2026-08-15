require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require("./config/dbConnection");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const authenticationRoutes = require("./routes/authenticationRoutes");
const userProfileRoutes = require("./routes/userProfileRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");



connectDB();

const app = express();

app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://e-commerce-platform-frontend-and-ba.vercel.app"
];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, Postman, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Blocked by CORS policy"));
    },
    credentials: true,
  })
);

app.get("/api/health", (req, res) => res.status(200).json({ success: true, message: "API is running" }));

app.use("/api/auth", authenticationRoutes);
app.use("/api/users", userProfileRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));