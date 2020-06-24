const articleModel = require('../models/articleModels')
const jwt = require('jsonwebtoken');

function getAll(req, res, next) {
    jwt.verify(res.token, 'my_secret_key', function (err, data) {
        if (err) {
            res.redirect('/register');
            return;
        }
        const { isLogged } = res.body;
        articleModel.getAllArticles().then(articles => {
            const content = {};
            articleModel.articlesCategory.map(
                category => {
                    content[category.title] = [];
                    articles.map(art => {
                        if (category.descr === art.category) {
                            content[category.title].push(art)
                        }
                    })
                }
            )
            res.render('home.hbs', { content, isLogged });
        }).catch(next)
    });

}

function getDetails(req, res, next) {
    jwt.verify(res.token, 'my_secret_key', function (err, data) {
        if (err) {
            res.redirect('/register');
            return;
        }
        const useremail = data.user.email;
        const { isLogged } = res.body;
        const id = +req.params.id;
        articleModel.getOneArticle(id).then(function (article) {
            const isAuthor = useremail === article['creator-email'];
            res.render('details.hbs', { article, isLogged, isAuthor });
        }).catch(next)
    });
}

function getEdit(req, res, next) {
    jwt.verify(res.token, 'my_secret_key', function (err, data) {
        if (err) {
            res.redirect('/register');
            return;
        }
        const { isLogged } = res.body;
        const id = +req.params.id;
        articleModel.getOneArticle(id).then(function (article) {
            res.render('edit.hbs', { article, isLogged });
        }).catch(next)
    });
}

function postEdit(req, res, next) {
    jwt.verify(res.token, 'my_secret_key', function (err, data) {
        if (err) {
            res.redirect('/register');
            return;
        }
        const updatedArticle = req.body;
        updatedArticle.id = +req.params.id
        articleModel.changeArticle(updatedArticle).then(function (article) {
            res.redirect('/');
        }).catch(next)
    });
}

function getDelete(req, res, next) {
    jwt.verify(res.token, 'my_secret_key', function (err, data) {
        if (err) {
            res.redirect('/register');
            return;
        }
        const id = +req.params.id;
        articleModel.delete(id).then(function () {
            res.redirect('/');
        }).catch(next)
    });
}

function getCreate(req, res) {
    jwt.verify(res.token, 'my_secret_key', function (err, data) {
        if (err) {
            res.redirect('/register');
            return;
        }
        const { isLogged } = res.body;
        res.render('create', { isLogged });
    });
}

function postCreate(req, res, next) {
    jwt.verify(res.token, 'my_secret_key', function (err, data) {
        if (err) {
            res.redirect('/login');
            return;
        }
        const newArticle = req.body;
        newArticle['creator-email'] = data.user.email;
        articleModel.add(newArticle).then(u => {
            res.redirect('/');
        }).catch(error => {
            console.log(error);
            res.redirect('/login');
        });

    });
}


module.exports = {
    getAll,
    getDetails,
    getEdit,
    postEdit,
    getDelete,
    getCreate,
    postCreate
}