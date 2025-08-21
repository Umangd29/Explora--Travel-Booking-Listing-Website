const express = require("express");
const router = express.Router();

const searchController = require("../controllers/search.js");

router.get("/", searchController.renderSearchedList);

module.exports = router;
