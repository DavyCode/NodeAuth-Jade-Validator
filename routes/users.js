var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
    // res.send('respond with a resource');
    console.log('users route')
});

router.get('/register', function(req, res, next) {
    res.render('register', { 'title': 'Register' });
});

router.get('/login', function(req, res, next) {
    res.render('login', { 'title': 'Login' });
});

//register post route
router.post('/register', function(req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;


    //check for image field
    if (req.files.profileimage) {
        console.log('Uploading file...');

        //File info
        var profileImageOriginalName = req.files.profileimage.originalname;
        var profileImageName = req.files.profileimage.name;
        var profileImageMime = req.files.profileimage.mimetype;
        var profileImagePath = req.files.profileimage.path;
        var profileImageExt = req.files.profileimage.extension;
        var profileImageSize = req.files.profileimage.size;
    } else {
        //Set a Default image
        var profileImageName = "noimage.png";
    }

    //form Validation
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email not valid').isEmail();
    req.checkBody('username', 'Username field is required').notEmpty();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    //Check for errors
    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors,
            name: name,
            email: email,
            username: username,
            password: password,
            password2: password2
        });
    } else {
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password,
            profileimage: profileImageName
        });

        //Create User
        User.createUser(newUser, function(err, user) {
            if (err) throw err;
            console.log(user)
        });
        req.flash('success', 'You have been registered kindly log in');
        res.location('/');
        res.redirect('/');
    }

});



passport.serializeUser(function(id, done) {
    done(null, user.id);
});

passport.serializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});



passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user) {
            if (err) throw err;
            if (!user) {
                console.log('Unknown user');
                return done(null, false, { message: 'Unknown User' });
            }
            User.comparePassword(password, user.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    console.log('invalid Password');
                    return done(null, false, { message: 'Invalid Password' });
                }
            })
        });

    }));

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Invalid username or password'
}), (req, res) => {
    console.log('Auth successful');
    req.flash("success", 'you are logged in')
    res.redirect('/secret');
});
module.exports = router;