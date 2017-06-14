var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthentication, function(req, res, next) {
    res.render('index', { title: 'Members' });
});



function ensureAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/users/login');
}
module.exports = router;