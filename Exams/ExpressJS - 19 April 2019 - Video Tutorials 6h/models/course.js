const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { String, Number, ObjectId } = Schema.Types;

const CourseSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,

    },
    description: {
        type: String,
        required: true,
        maxlength: [50, `The description should be maximum 50 characters long`]
    },
    imageUrl: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                const pattern = /^(https:\/\/|http:\/\/){1}[\w\W]+$/gi;
                return (v == null || v.trim().length < 1) || pattern.test(v)
            },
            message: `The imageUrl - should be actual link refering to the car image`
        }
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    lectures: [
        {
            type: ObjectId,
            ref: 'Lecture'
        }
    ],
    usersEnrolled: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ],
})

module.exports = mongoose.model('Course', CourseSchema);