const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

class UserModel {
    constructor() {
        this.userData = require('../config/usersDb.json')
    }

    _write(newData, resolveData) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path.resolve('./config/usersDb.json'), JSON.stringify(newData, null, 2), (err) => {
                if (err) { reject(err); return; }
                this.userData = newData;
                resolve(resolveData);
            });
        });
    }

    add(newUser) {
        if (this.isUserExist(newUser)) {
            return new Promise((resolve, reject) => {
                const error = {
                    "code": 409,
                    "message": "UserAlreadyExists",
                    "description": "This username is already taken. Please retry your request with a different username"
                }
                reject(error);
                return;
            });
        }
        const idNewUser = ++this.userData.lastIndex;
        newUser = { id: idNewUser, email: newUser.email, password: newUser.password };

        const newUserData = {
            lastIndex: idNewUser,
            users: this.userData.users.concat(newUser)

        }

        return this._write(newUserData, newUser);
    }

    login(user) {
        return new Promise((resolve, reject) => {
            if (!this.userData.users.find(u => u.email === user.email && u.password === user.password)) {
                const err = {
                    "code": 401,
                    "message": "InvalidCredentials",
                    "description": "Invalid credentials. Please retry your request with correct credentials"
                }
                resolve(err);
            }
            const token = jwt.sign({ user }, 'my_secret_key');
            resolve({ useremail: user.email, token });
        })
    }

    isUserExist(newUser) {
        return !!this.userData.users.find(({ email }) => email === newUser.email);
    }

}

module.exports = new UserModel();