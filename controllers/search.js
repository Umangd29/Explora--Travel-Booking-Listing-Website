const Listing = require('../models/listings');


module.exports.renderSearchedList = async (req, res) => {
  const { q } = req.query; 
  if (!q) {
    return res.render("listings/index", { allListing: [] });
  }

  try {
    const results = await Listing.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ]
    });

    res.render("listings/index", { allListing: results });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};