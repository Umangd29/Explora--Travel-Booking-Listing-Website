const Listing = require('../models/listings');

const validCategories = ["Rooms", "Iconic-Cities", "Trending", "Mountains", "Castles", "Amazing-Pools", "Camping", "Farm", "Arctic", "Beach", "Boat", "Ski-in-out", "Apartment", "New", "Woodlands", "Lake", "Cabins", "Countryside", "Campsite", "Historical-Homes"];


module.exports.renderCategoryList = async (req, res) => {
    let { category } = req.params;

    if (!validCategories.includes(category)) {
        return res.status(404).send("Invalid category");
    }

    const allListing = await Listing.find({ category });
    // req.flash("success", "Lists of category");
    res.render("listings/index", { allListing });
};