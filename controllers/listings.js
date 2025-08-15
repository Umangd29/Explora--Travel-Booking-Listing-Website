const Listing = require('../models/listings');

module.exports.index = async (req, res) => {
    const allListing = await Listing.find();
    res.render("listings/index", { allListing });
};

module.exports.renderNewForm = (req, res, next) => {
    res.render("listings/new.ejs");
};

module.exports.newListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.Listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "List created sucessfully");
    res.redirect("/listings");
};

module.exports.showDetails = async (req, res, next) => {
    let { id } = req.params;
    const List = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            }
        }).populate("owner");
    if (!List) {
        req.flash("error", "List you requested is does not exit");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { List });
};

module.exports.renderEditForm = async (req, res, next) => {
    let { id } = req.params;
    const List = await Listing.findById(id);
    if (!List) {
        req.flash("error", "List you requested is does not exit");
        return res.redirect("/listings");
    }
    let originalImageUrl = List.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    console.log(originalImageUrl);
    res.render("listings/edit.ejs", { List, originalImageUrl});
};

module.exports.updateListing = async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.Listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        newListing.image = { url, filename };
        await newListing.save();
    }
    req.flash("success", "List updated sucessfully");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res, next) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "List deleted sucessfully");
    res.redirect("/listings");
};