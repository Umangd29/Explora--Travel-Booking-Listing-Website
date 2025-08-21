const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require('../models/listings');
const Review = require('../models/review');
const { validateReview, isReviewAuthor, isLoggedIn } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");


router.post('/', isLoggedIn, validateReview, wrapAsync(reviewController.createReview),
);

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview),
);

module.exports = router;