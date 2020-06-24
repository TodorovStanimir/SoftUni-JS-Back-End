function getAbout(req, res) {
    res.render('about.hbs')
}

function notFound(req, res) {
    res.render('404.hbs')
}

module.exports = {
    getAbout,
    notFound
}