const { accessoryModel, cubeModel } = require('../models');

module.exports = {
    get: {
        create: function (req, res, next) {
            const user = req.user;
            res.render('createAccessory.hbs', { user });
        },
        attach: function (req, res, next) {
            const { id: cubeId } = req.params;
            const user = req.user;
            cubeModel.findById(cubeId).then(
                cube => Promise.all([cube, accessoryModel.find({ cubes: { $nin: cube._id } })])
                    .then(([cube, filterAccessories]) => res.render('attachAccessory.hbs', { accessories: filterAccessories, cube, user }))
                    .catch(next));
        }
    },
    post: {
        create: function (req, res, next) {
            const accessory = { ...req.body };
            accessoryModel.create({ ...accessory })
                .then(created => { res.redirect('/'); })
                .catch(err => {
                    if (err.name === 'ValidationError') {
                        res.render('createAccessory.hbs', {
                            errors: err.errors,
                            accessory
                        });
                        return
                    }
                    next(err)
                });
        },
        attach: function (req, res, next) {
            const { id: cubeId } = req.params;
            const { accessory: accessoryId } = req.body;
            Promise.all([
                cubeModel.updateOne({ _id: cubeId }, { $push: { accessories: accessoryId } }),
                accessoryModel.updateOne({ _id: accessoryId }, { $push: { cubes: cubeId } })])
                .then(() => {
                    res.redirect('/')
                })
                .catch(next);
        }
    }
}
