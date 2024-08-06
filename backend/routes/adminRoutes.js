const express = require("express");
const adminController = require("../controllers/adminController");
const router = express.Router();

router.post("/product", adminController.addProduct);

module.exports = router;
