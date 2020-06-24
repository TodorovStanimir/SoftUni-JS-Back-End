const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { String, Number, ObjectId } = Schema.Types;

const ExpenseSchema = new Schema({
    merchant: {
        type: String,
        required: true,
        minlength:[4, 'The merchant should be at least 4 characters long']
        // validate: {
        //     validator: function (v) {
        //         const pattern = /^[\w\W]{4,}$/gi;
        //         return v == null || v.trim().length < 4 || !pattern.test(v)
        //     },
        //     message: `The merchant should be at least 4 characters long`
        // }
    },
    date: {
        type: Date,
        required: true,
        default: new Date(),
    },
    total: {
        type: Number,
        required: true,
        min: [0.01, `The total should be positive number`]
    },
    description: {
        type: String,
        required: true,
        minlength: [10, `The description should be minimum 10 characters long`],
        maxlength: [50, `The description should be maximum 50 characters long`]
    },
    category: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                const category = ["advertising", "benefits", "car", "equipment",
                    "fees", "home-office", "insurance", "interest", "Labor",
                    "maintenance", "materials", "meals-and-entertainment", "office-supplies",
                    "other", "professional-services", "rent", "taxes", "travel", "utilities"];
                return v == null || category.includes(v)
            },
            message: `The category is not correct`
        }
    },
    report: {
        type: Boolean,
        required: true,
        default: false
    },
    user: {
        type: ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Expense', ExpenseSchema);