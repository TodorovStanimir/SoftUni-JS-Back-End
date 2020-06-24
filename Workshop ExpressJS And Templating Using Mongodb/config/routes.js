const controllers = require('../controllers');
const { auth } = require('../utils');

module.exports = (app) => {

    app.route('/')
        .get(auth(false), controllers.cube.get.allCubes)
        .post(auth(false), controllers.cube.post.searchCubes)

    app.route('/register')
        .get(controllers.user.get.register)
        .post(controllers.user.post.register)

    app.route('/login')
        .get(controllers.user.get.login)
        .post(controllers.user.post.login)

    app.route('/logout')
        .get(controllers.user.get.logout)

    app.route('/create')
        .get(auth(), controllers.cube.get.create)
        .post(auth(), controllers.cube.post.create)

    app.route('/edit/:id')
        .get(auth(), controllers.cube.get.edit)
        .post(auth(), controllers.cube.post.edit)

    app.route('/delete/:id')
        .get(auth(), controllers.cube.get.delete)
        .post(auth(), controllers.cube.post.delete)

    app.route('/details/:id')
        .get(auth(), controllers.cube.get.cube)


    app.route('/create/accessory')
        .get(auth(), controllers.accessory.get.create)
        .post(auth(), controllers.accessory.post.create)

    app.route('/attach/accessory/:id')
        .get(auth(), controllers.accessory.get.attach)
        .post(auth(), controllers.accessory.post.attach)

    app.route('/about')
        .get(auth(false), controllers.other.get.about)

    app.route('*')
        .all(auth(), controllers.other.get.notFound)
};
