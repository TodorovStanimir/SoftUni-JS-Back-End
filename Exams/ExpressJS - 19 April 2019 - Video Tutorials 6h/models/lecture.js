const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { String, Number, ObjectId } = Schema.Types;

const LectureSchema = new Schema({
    title: {
        type: String,
        required: true,
        // validate: {
        //     validator: function (v) {
        //         const pattern = /^[\w\W]{4,} - [\w\W]{4,}$/gi;
        //         return (v == null || v.trim().length < 1) || pattern.test(v)
        //     },
        //     message: `The Starting Point - End Point - Starting and End point should be at least 4 characters long (each) and should be separated with single space, dash and another single space (" - ")`
        // }
    },
    videoUrl: {
        type: String,
        required: true,
    },
    course: {
        type: ObjectId,
        ref: 'Course',
    },
})

module.exports = mongoose.model('Lecture', LectureSchema);