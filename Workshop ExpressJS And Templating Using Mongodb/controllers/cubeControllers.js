const { cubeModel } = require('../models');
const { renderDificultyLevel, handleValidationErrors } = require('../app-config')

module.exports = {
    get: {
        allCubes: function (req, res, next) {
            const user = req.user;
            cubeModel.find().then(cubes => {
                res.render('index.hbs', { cubes, user });
            }).catch(next)
        },
        cube: function (req, res, next) {
            const user = req.user;
            const id = req.params.id;
            cubeModel.findById(id).populate('accessories').then(cube => {
                const isCreator = user.id === cube.creatorId.toString() ? true : false;
                res.render('details.hbs', { cube, user, isCreator });
            }).catch(next)
        },
        create: function (req, res) {
            const user = req.user;
            res.render('create.hbs', { user });
        },
        edit: function (req, res, next) {
            const id = req.params.id;
            const user = req.user;
            cubeModel.findById({ _id: id, creatorId: user.id }).then(cube => {
                const cubeDifficultyLevel = renderDificultyLevel(cube.difficultyLevel);
                res.render('editCube.hbs', { cube, user, cubeDifficultyLevel });
            }).catch(next)
        },
        delete: function (req, res, next) {
            const id = req.params.id;
            const user = req.user;
            cubeModel.findById({ _id: id, creatorId: user.id }).then(cube => {
                const cubeDifficultyLevel = renderDificultyLevel(cube.difficultyLevel);
                res.render('deleteCube.hbs', { cube, user, cubeDifficultyLevel });
            }).catch(next)
        }
    },
    post: {
        searchCubes(req, res, next) {
            const { search, from, to } = req.body;
            const user = req.user;
            cubeModel.find().then(cubes => {
                const filteredCubes = cubes.filter(cube => {
                    return (from !== "" && to !== "")
                        ? cube.name.toLowerCase().includes(search.toLowerCase()) && cube.difficultyLevel >= Number(from) && cube.difficultyLevel <= Number(to)
                        : cube.name.toLowerCase().includes(search.toLowerCase())
                });
                res.render('index.hbs', { user, cubes: filteredCubes.length > 0 ? filteredCubes : cubes });
            }).catch(next)
        },
        create: function (req, res, next) {
            const cube = { ...req.body, creatorId: req.user.id }
            cubeModel.create({ ...cube }).then(cube => {
                res.redirect('/');
            }).catch(err => {
                err.name = 'ValidationError'
                    ? handleValidationErrors(err, res, 'create.hbs', cube)
                    : next(err)
            })
        },
        edit: function (req, res, next) {
            const id = req.params.id;
            const creatorId = req.user.id;
            const cube = { ...req.body, id, creatorId };
            cubeModel.updateOne({ _id: id }, { ...cube }, { runValidators: true }).then(cube => {
                res.redirect('/');
            }).catch(err => {
                err.name = 'ValidationError'
                    ? handleValidationErrors(err, res, 'editCube.hbs', cube)
                    : next(err)
            })
        },
        delete: function (req, res, next) {
            const id = req.params.id;
            cubeModel.findByIdAndDelete({ _id: id }).then(() => {
                res.redirect('/');
            }).catch(next)
        }
    }
}