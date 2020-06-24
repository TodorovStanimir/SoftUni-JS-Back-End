const userModel = require('../models/userModels')

function getLogin(req, res) {
    res.render('login');
}

function postLogin(req, res, next) {
    const user = req.body;
    userModel.login(user).then(u => {
        res.body = u;
        next()
    }).catch(next);
}

function getRegister(req, res) {
    res.render('register');
}

function postRegister(req, res) {
    const newUser = req.body;
    if (newUser.password !== newUser['rep-pass']) {
        res.redirect('/register');
        return;
    }
    userModel.add(newUser).then(u => {
        res.redirect('/login');
    }).catch(error => {
        console.log(error);
        res.redirect('/register');
    });
}

function addToken(req, res, next) {
    if (req.cookies.user && req.cookies.user.token !== null) {
        const token = req.cookies.user.token;
        res.header({
            "Authorization": `Bearer ${token}`
        })
        next();
    } else {
        res.redirect('/login')
    }
}

function ensureToken(res, req, next) {
    const bearerHeader = req._headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next()
    } else {
        redirect('/login');
    }
}

function getLogout(req, res) {
    isLogged = false;
    res.clearCookie('user');
    res.redirect('/login');
}

function isLogged(req, res, next) {
    if (req.cookies.user && req.cookies.user.useremail !== null) {
        const isLogged = true;
        res.body = { isLogged };
        next();
    } else {
        res.redirect('/login')
    }
}

function setCookie(req, res) {
    const user = Object.assign({}, res.body);
    res.cookie('user', user);
    res.redirect('/')
}


module.exports = {
    getLogin,
    postLogin,
    getLogout,
    getRegister,
    postRegister,
    ensureToken,
    addToken,
    isLogged,
    setCookie
}