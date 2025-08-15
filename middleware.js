const Listing = require("./models/listings.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Login First");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    const List = await Listing.findById(id);
    if(!List.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "you are not the owner of list");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
   
    let { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(", ");
       
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
   
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(", ");
     
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "you are not the author of review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}