require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const isAuth = require("./middleware/is-auth");

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());

// Jest test route
// app.use("/", (req, res, next) => {
//   res.status(200).send("Hello Jest");
// });

app.use("/api", isAuth);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  console.log(err.message, err.code);

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
