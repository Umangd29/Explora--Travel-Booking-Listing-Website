const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const listingController = require("../controllers/category.js");


router.get("/:category", wrapAsync(listingController.renderCategoryList));

module.exports = router;
