const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { String, Number, ObjectId } = Schema.Types;

const TripSchema = new Schema({
    startingPoint: {
        type: String,
        required: true,
        minlength: [4, 'Starting point should be at least 4 characters long.']
        // validate: {
        //     validator: function (v) {
        //         const pattern = /^[\w\W]{4,}$/gi;
        //         return v == null || v.trim().length < 4 || !pattern.test(v)
        //     },
        //     message: `The merchant should be at least 4 characters long`
        // }
    },
    endPoint: {
        type: String,
        required: true,
        minlength: [4, 'End point should be at least 4 characters long.']
        // validate: {
        //     validator: function (v) {
        //         const pattern = /^[\w\W]{4,}$/gi;
        //         return v == null || v.trim().length < 4 || !pattern.test(v)
        //     },
        //     message: `The merchant should be at least 4 characters long`
        // }
    },
    date: {
        type: String,
        required: true,
        minlength: [6, 'Dateshould be at least 6 characters long.']
    },
    time: {
        type: String,
        required: true,
        minlength: [6, 'Time should be at least 6 characters long.']
    },
    seats: {
        type: Number,
        required: true,
        min: [1, 'The Seats should be positive number.']
    },
    description: {
        type: String,
        required: true,
        minlength: [10, 'The description should be minimum 10 characters long']
    },
    carImage: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                const pattern = /^(https:\/\/|http:\/\/){1}[\w\W]+$/gi;
                return v == null || v.trim().length < 1 || pattern.test(v)
            },
            message: `The CarImage - should be actual link refering to the car image`
        }
    },
    buddies: [{
        type: ObjectId,
        ref: 'User'
    }]
})

module.exports = mongoose.model('Trip', TripSchema);