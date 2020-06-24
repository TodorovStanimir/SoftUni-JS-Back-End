const routers = require('../routers');

module.exports = (app) => {
  app.use('/home', routers.home)

  app.use('/user', routers.user)

  app.use('/course', routers.course)
}