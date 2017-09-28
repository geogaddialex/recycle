exports.render = function(req, res) {
    res.render('index', {
        title: 'Recycle',
        user: req.user ? req.user.username : ''
    });
};