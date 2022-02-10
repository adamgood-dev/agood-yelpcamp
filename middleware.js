const {campgroundSchema, reviewSchema} = require("./schemas");
const Campground = require("./models/campground");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");

// Check if a user is logged in.
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', "Please log in to continue");
        return res.redirect('/login');
    }
    next();
}

// Validate a user-created campground on creation.
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// Check if a user is authorized to edit a particular campground
module.exports.isAuthorized = async(req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', "You do not have permission to edit this campground");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

// Validation of a user-created review before posting
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// Check if a user is the author of a review before letting them delete
module.exports.isReviewAuthor = async(req, res, next) => {
    const {id, review_id} = req.params;
    const review = await Review.findById(review_id);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', "You do not have permission to edit this review");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}