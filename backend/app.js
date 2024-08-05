require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const isAuth = require("./middleware/isAuth");
const locationRoutes = require("./routes/locationRoutes");

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);

// Routes below require authentication
app.use("/api/location", isAuth, locationRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  const code = err.code || "SERVER_INTERNAL_ERROR";
  res.status(status).json({
    status,
    message,
    code,
  });
});

module.exports = app;
