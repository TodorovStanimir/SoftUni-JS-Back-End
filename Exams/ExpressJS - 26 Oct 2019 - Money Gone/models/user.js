const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { String, Number, ObjectId } = Schema.Types;

const bcrypt = require('bcrypt');
const config = require('../config/config')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                const pattern = /^[a-zA-Z0-9]{4,}$/gi;
                return v == null || v.trim().length < 4 || pattern.test(v)
            },
            message: `The username should be at least 4 characters long and should consist only english letters and digits`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'The password should be at least 8 characters long']
    },
    amount: {
        type: Number,
        required: true,
        default: 0,
        min: [0, `The account amount  should be positive number`]
    },
    expenses: [
        {
            type: ObjectId,
            ref: 'Expense'
        }
    ]

})

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        bcrypt.genSalt(config.saltRounds, (err, salt) => {
            if (err) { next(err); return }
            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err) { next(err); return }
                this.password = hash;
                next();
            })
        });
        return;
    }
    next();
})

userSchema.methods = {
    matchPassword: function (password) {
        return bcrypt.compare(password, this.password);
    }
}

module.exports = mongoose.model('User', userSchema);