const express = require("express");
const router = express.Router();
const Listing = require('../models/listings');
const wrapAsync = require("../utils/wrapAsyns.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const {storage} = require ("../cloudConfig.js");
const upload = multer ({storage});


const listingController = require("../controllers/listings.js");


router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single("Listing[image]"), validateListing, wrapAsync(listingController.newListing),
    );


router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showDetails),
    )
    .put( isLoggedIn, isOwner,upload.single("Listing[image]"), validateListing, wrapAsync(listingController.updateListing)
    )
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)
    );

router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm),
);


module.exports = router;