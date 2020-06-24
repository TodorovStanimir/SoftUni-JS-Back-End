const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'username length should be at least 5 characters long!'],
        validate: [
            {
                validator: function (v) {
                    return /^[A-Za-z0-9]+$/.test(v);
                },
                message: () => `User name should consists English latters and digits!`
            }
        ]
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password length should be at least 8 characters long!'],
        validate: [
            {
                validator: function (v) {
                    return /^[A-Za-z0-9]+$/.test(v);
                },
                message: () => `Password should consists English latters and digits!`
            }
        ]
    }
})

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        bcrypt.genSalt(saltRounds, (err, salt) => {
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