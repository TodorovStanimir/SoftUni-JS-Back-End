const routers = require('../routers');

module.exports = (app) => {
    app.use('/user', routers.user);
    app.use('/', routers.course);
}