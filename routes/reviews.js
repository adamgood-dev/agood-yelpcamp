const express = require("express");
const router = express.Router({mergeParams: true});
const catchAsync = require("../utils/CatchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const Review = require("../models/review");
const reviews = require("../controllers/reviews");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware")

// Routing
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete("/:review_id", isLoggedIn, isReviewAuthor, catchAsync(reviews.destroyReview))

module.exports = router;