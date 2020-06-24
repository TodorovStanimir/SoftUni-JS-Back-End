const cubeControlers = require('../controllers/cubeControlers');
const otherControlers = require('../controllers/otherControlers')

module.exports = (app) => {

    app.get('/', cubeControlers.getAllCubes)

    app.post('/', cubeControlers.searchCubes)

    app.get('/details/:id', cubeControlers.getCube)

    app.get('/about', otherControlers.getAbout)

    app.get('/create', cubeControlers.getCreate)

    app.post('/create', cubeControlers.postCreate)

    app.all('*', otherControlers.notFound)
  
};