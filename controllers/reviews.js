const Listing = require('../models/listings');
const Review = require('../models/review');

module.exports.createReview = async (req, res, next) => {
    let { id } = req.params;

    // Find the listing
    let listing = await Listing.findById(id);
    if (!listing) throw new ExpressError(404, "Listing not found");

    // Create and save the review
    let newReview = new Review(req.body.Review);
    newReview.author = req.user._id;
    await newReview.save();

    // Associate review with listing
    listing.reviews.push(newReview);
    await listing.save();

    req.flash("success", "review created sucessfully");

    // Redirect to show page
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "review deleted sucessfully");
    res.redirect(`/listings/${id}`);
};
