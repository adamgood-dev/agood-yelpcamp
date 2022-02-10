const Campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const {cloudinary} = require("../cloudinary");

// Render the campgrounds index after querying database
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}

// Render login form
module.exports.newForm = (req, res) => {
    res.render("campgrounds/new");
}

// Create a campground with input data, geocode the location for mapbox, attach the campground to user and save to db
module.exports.newCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', "Successfully made a new campground.");
    res.redirect(`/campgrounds/${campground._id}`);
}

// Render a campground's detailed view
module.exports.campgroundDetails = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', "Campground not found.");
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/details', {campground});
}

// Render a campground's edit page, is it exists
module.exports.editForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', "Campground not found.");
        res.redirect('/campgrounds');
    }
    res.render("campgrounds/edit", {campground});
}

// Update a campground, adding and deleting images as necessary
module.exports.updateCampground = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages} } } });
    }
    req.flash('success', 'Campground has been updated.');
    res.redirect(`/campgrounds/${campground._id}`);
}

// Delete a campground.
// TODO: Delete images from Cloudinary on campground deletion
module.exports.destroyCampground = async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', "Campground has been deleted.");
    res.redirect("/campgrounds");
}