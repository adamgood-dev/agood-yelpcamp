const express = require("express");
const router = express.Router({mergeParams: true});
const catchAsync = require("../utils/CatchAsync");
const reviews = require("../controllers/reviews");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware")

// Routing for review creation and deletion

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete("/:review_id", isLoggedIn, isReviewAuthor, catchAsync(reviews.destroyReview))

module.exports = router;