const express = require("express");
const locationController = require("../controllers/locationController");

const router = express.Router();

router.get("/products", locationController.getProducts);

module.exports = router;
