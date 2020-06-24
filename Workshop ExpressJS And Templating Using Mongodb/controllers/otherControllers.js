module.exports = {
    get: {
        about: function (req, res) {
            const user = req.user;
            res.render('about.hbs', { user })
        },
        notFound: function (req, res) {
            const user = req.user;
            res.render('404.hbs', { user })
        }
    }
}