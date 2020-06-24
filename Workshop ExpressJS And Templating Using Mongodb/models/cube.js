const mongoose = require('mongoose');

const cubeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [5, 'Name should be at least 5 characters long!'],
        validate: [
            {
                validator: function (v) {
                    return /^[A-Za-z0-9\s]+$/.test(v);
                },
                message: () => `Name should consists English letters, digits and whitespaces!`
            }
        ]
    },
    description: {
        type: String,
        required: true,
        minlength: [20, 'Description should be at least 20 characters long!'],
        validate: [
            {
                validator: function (v) {
                    return /^[A-Za-z0-9\s]+$/.test(v);
                },
                message: () => `Description should consists English letters, digits and whitespaces!`
            }
        ]
    },
    imageUrl: {
        type: String,
        required: true,
        validate: [
            {
                validator: function (v) {
                    return /^http[s]?:\/\/.+/gi.test(v);
                },
                message: () => `imageUrl should starts with http:// or https://!`
            }
        ]
    },
    difficultyLevel: {
        type: Number,
        required: true,
        min: 1,
        max: 6
    },
    accessories: [{ type: mongoose.Types.ObjectId, ref: 'Accessory' }],
    creatorId: { type: mongoose.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Cube', cubeSchema);