const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/CatchAsync");
const campgrounds = require("../controllers/campgrounds");
const {isLoggedIn, isAuthorized, validateCampground} = require("../middleware");
const multer = require("multer");
const {storage} = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.newCampground));

router.get("/new", isLoggedIn, campgrounds.newForm)

router.route('/:id')
    .get(catchAsync(campgrounds.campgroundDetails))
    .put(isLoggedIn, isAuthorized, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, catchAsync(campgrounds.destroyCampground));

router.get("/:id/edit", isLoggedIn, isAuthorized, catchAsync(campgrounds.editForm))

module.exports = router;