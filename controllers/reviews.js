const Campground = require("../models/campground");
const Review = require("../models/review");

// Create a new review, save to database and attach it to campground
module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', "Your review has been posted.");
    res.redirect(`/campgrounds/${campground._id}`);
}

// Review deletion
module.exports.destroyReview = async (req, res) => {
    const {id, review_id} = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
    await Review.findByIdAndDelete(review_id);
    req.flash('success', "Review has been deleted.");
    res.redirect(`/campgrounds/${id}`);
}