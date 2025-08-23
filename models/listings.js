const mongoose = require('mongoose');
const { Schema } = mongoose;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    description: String,

    image: {
        filename: String,
        url: String,
    },

    price: Number,
    location: String,
    country: String,

    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    category: {
        type: [String],
        enum: ["Rooms","Iconic-Cities","Trending","Mountains","New","Castles","Amazing-Pools","Camping","Farm","Arctic","Beach","Boat","Ski-in-out","Apartment","NAew","Woodlands","Lake","Cabins","Countryside","Bed-and-Breakfasts","Campsite","Historical-Homes"],
        // required: true
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing && listing.reviews.length) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;