const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { String, Number, ObjectId } = Schema.Types;

const bcrypt = require('bcrypt');
const config = require('../config/config')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                const pattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/gi;
                return pattern.test(v)
            },
            message: `The email should be in the following format (mailboxname @ domainname) -  "username@domain.bg"`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'The password should be at least 6 characters long']
    },
    trippsHistory: [
        {
            type: ObjectId,
            ref: 'Trip'
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