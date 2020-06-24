const { articleModel, categoryModel } = require('../models')

function getAll(req, res, next) {
    const user = req.user;
    categoryModel.find()
        .populate('articles')
        .then(categories => {
            const content = {};
            categories.map(category => {
                content[category.title] = category.articles.map(art => { return { title: art.title, content: art.content, id: art.id.toString() } })
            })
            res.render('home.hbs', { content, user })
        }).catch(next)
}

function getDetails(req, res, next) {
    const user = req.user;
    const id = req.params.id;
    articleModel.findById({ _id: id }).populate('category').then(article => {
        const isAuthor = user.id === article.creatorId._id.toString();
        res.render('details.hbs', { article, isAuthor, user });
    }).catch(next)
}

function getEdit(req, res, next) {
    const user = req.user;
    const id = req.params.id;
    articleModel.findById({ _id: id }).populate('category').then(article => {
        const isAuthor = user.id === article.creatorId._id.toString();
        res.render('edit.hbs', { article, isAuthor, user });
    }).catch(next)
}

function postEdit(req, res, next) {
    const id = req.params.id;
    const { title, category, content } = req.body;
    articleModel.updateOne({ _id: id }, { title, content }).then(article => {
        res.redirect('/');
    }).catch(next)
}

async function getDelete(req, res, next) {
    try {
        const id = req.params.id;
        const article = await articleModel.findById({ _id: id });
        const categoryId = article.category.toString();
        await categoryModel.findByIdAndUpdate({ "_id": categoryId }, { $pull: { articles: id } });
        await categoryModel.findByIdAndUpdate({ "_id": "5eaf3550c63c85339d399424" }, { $pull: { articles: "5eaf36476530ee14bc57f3c8" } });
        await articleModel.findByIdAndRemove({ _id: id });
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
}

function getCreate(req, res) {
    const user = req.user;
    res.render('create', { user });
}

function postCreate(req, res, next) {
    const { title, content, category: titleCategory } = req.body;
    const creatorId = req.user.id;
    categoryModel
        .findOne({ title: titleCategory })
        .then(category => {
            return Promise.all([category, articleModel.create({ title, content, category: category._id, creatorId })])
        })
        .then(([category, result]) => {
            return Promise.all([category, result, categoryModel.updateOne({ _id: category._id }, { $push: { articles: result._id } })])
        })
        .then(([category, result, updatedCategory]) => res.redirect('/'))
        .catch(next)
}


module.exports = {
    getAll,
    getDetails,
    getEdit,
    postEdit,
    getDelete,
    getCreate,
    postCreate,
}