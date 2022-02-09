const mongoose = require("mongoose");
const { campgroundSchema } = require("../schemas");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema ( {
        url: String,
        filename: String,

})

const opts = { toJSON: { virtuals: true } };

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200')
})

const CampgroundSchema = new Schema( {
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
}, opts)

CampgroundSchema.virtual('properties.popUpMarkUp').get(function() {
    return `
        <strong>
            <a href="/campgrounds/${this._id}" style="text-decoration: none">
                ${this.title}
            </a>
        </strong>
        <p>${this.description.substring(0, 20)}...`
})

CampgroundSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campgrounds', CampgroundSchema);