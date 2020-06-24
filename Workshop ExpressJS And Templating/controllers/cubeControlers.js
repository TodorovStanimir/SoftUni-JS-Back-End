const cubeModel = require('../models/cube');

function getAllCubes(req, res, next) {
    cubeModel.getAll().then(cubes => {
        res.render('index.hbs', { cubes });
    }).catch(next)
}

function searchCubes(req, res, next) {
    const { search, from, to } = req.body;
    cubeModel.getAll().then(cubes => {
        const filteredCubes = cubes.filter(cube => {
            return (from !== "" && to !== "")
                ? cube.name.toLowerCase().includes(search.toLowerCase()) && cube.difficultyLevel >= Number(from) && cube.difficultyLevel <= Number(to)
                : search!=="" ? cube.name.toLowerCase().includes(search.toLowerCase()) : cubes 
        })
        res.render('index.hbs', { cubes: filteredCubes.length > 0 ? filteredCubes : cubes });
    }).catch(next)
}

function getCube(req, res, next) {
    const id = +req.params.id;
    cubeModel.getOne(id).then(cube => {
        if (!cube) {
            res.redirect('/not-found');
            return
        }
        res.render('details.hbs', { cube });
    }).catch(next)
}

function getCreate(req, res) {
    res.render('create.hbs');
}

function postCreate(req, res, next) {

    const { name, description, imageUrl, difficultyLevel } = req.body;
    const newCube = cubeModel.create(name, description, imageUrl, difficultyLevel);
    cubeModel.insert(newCube)
        .then(cube => {
            res.redirect('/');
        })

}

module.exports = {
    getAllCubes,
    searchCubes,
    getCube,
    getCreate,
    postCreate
};