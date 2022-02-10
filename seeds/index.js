const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const {places, descriptors} = require("./seedHelpers");

// Program to seed database with procgen campgrounds
// For local testing & development purposes only.
// Primarily used earlier in development, likely needs some fixes
// To use with the final version of the app.

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Database Connected");
});

const sample =  array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const rand = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 10;
        const camp = new Campground({
            author: '61f9c1cff412034157f48dc1',
            location: `${cities[rand].city}, ${cities[rand].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odio ducimus quisquam sequi consequatur quo? Est ad numquam repellat deserunt saepe possimus minima nulla, sequi commodi asperiores, aliquam earum repellendus odit?",
            price,
            geometry: { 
                type: 'Point', 
                coordinates: [cities[rand].longitude, cities[rand].latitude] 
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dupjx4imv/image/upload/v1643852075/Yelpcamp/rx7awy2lfzn2u72ronmw.jpg',
                    filename: 'Yelpcamp/rx7awy2lfzn2u72ronmw'
                },
                {
                    url: 'https://res.cloudinary.com/dupjx4imv/image/upload/v1643852075/Yelpcamp/rx7awy2lfzn2u72ronmw.jpg',
                    filename: 'Yelpcamp/rx7awy2lfzn2u72ronmw'
                },
            ]
        });
        await camp.save();
    }
}

seedDB().then(() => {
    db.close();
})