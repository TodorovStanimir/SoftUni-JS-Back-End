const jwt = require('./jwt');
const auth = require('./auth');
const getUserStatus = require('./getUserStatus');
const { courseValidator, userValidator } = require('./validators');
const isAdmin = require('./isAdmin');


module.exports = {
    jwt,
    auth,
    getUserStatus,
    courseValidator,
    userValidator,
    isAdmin
}