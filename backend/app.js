require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(bodyParser.json());

app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  console.log(err.stack);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  const code = err.code || "SERVER_INTERNAL_ERROR";
  res.status(status).json({
    success: false,
    error: {
      message,
    },
  });
});

mongoose
  .connect(process.env.MONGO_URI, { dbName: "swift_pos" })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Listening on port ${process.env.PORT || 8080}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
