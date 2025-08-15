// Import dependencies
const mongoose = require('mongoose');
const Listing = require('../models/listings.js');  // Mongoose model
const initData = require('./data.js');             // Sample data to seed DB

// ---------------------------------------------
// DATABASE CONNECTION
// ---------------------------------------------

main()
    .then(() => {
        console.log("Wanderlust DB connected");
    })
    .catch((err) => {
        console.log("Connection error:", err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}

// ---------------------------------------------
// SEED DATABASE FUNCTION
// ---------------------------------------------

const initDB = async () => {
    try {
        await Listing.deleteMany({});
        initData.data = initData.data.map((obj) => ({ ...obj, owner: "689a2e016b4cca2701f74a83", }));
        await Listing.insertMany(initData.data);
        console.log("Database seeded successfully");
    } catch (err) {
        console.log("Seeding error:", err);
    }
};

initDB();
