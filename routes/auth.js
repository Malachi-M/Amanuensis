var express = require('express');
var passport = require('passport');
var User = require('../models/User');

exports.init = function() {
    var router = express.Router();

    //Configuration of passport with methods from passport-local-mongoose
    passport.use(User.createStrategy());
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    router.use(passport.initialize());
    router.use(passport.session());

    router.use(function(req, res, next) {
        var user = req.user;
        if (user) {
            res.locals.user = {
                username: user.username
            };
        }
        next();
    });


    //code to render registration form
    router.route('/join').get(function(req, res) {
            res.render('register', {
                title: 'Amanuensis | New Account'
            });
        })
        .post(function(req, res) {
            //console.log(req.body);
            if (req.body.password !== req.body.passwordTwo) {
                return res.render('register', {
                    title: "Amanuensis | New Account",
                    notification: {
                        severity: "error",
                        message: "Not able to register your account: Passwords were found to not match!"
                    },
                });
            }
            if (req.body.email === "" || req.body.email.length < 1) {
                return res.render('register', {
                    title: "Amanuensis | New Account",
                    notification: {
                        severity: "error",
                        message: "A valid email is required"
                    }
                });
            }
            if (req.body.username === "" || req.body.username.length < 1) {
                return res.render('register', {
                    title: "Amanuensis | New Account",
                    notification: {
                        severity: "error",
                        message: "Username is required"
                    }
                });
            }
            console.log('Joining: ' + req.body.username + "\n" + req.body.email);
            User.register(new User({
                username: req.body.username,
                user_email: req.body.email
            }), req.body.password, function(err, user) {
                if (err) {
                    return res.render('register', {
                        title: "Amanuensis | New Account",
                        notification: {
                            severity: "error",
                            message: "Not able to register your account: " + err.message
                        },
                        user: user
                    });
                }
                passport.authenticate('local')(req, res, function() {
                    res.redirect('/');
                });
            });
        });

    //Code to render the login form.
    router.route('/login')
        .get(function(req, res) {
            res.render('login', {
                title: 'Amanuensis - Log in',
                user: req.user
            });
        })
        .post(function(req, res, next) {
            //Authenticate
            passport.authenticate('local', function(err, user, info) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    console.log(err);
                    console.log(user);
                    return res.render('login', {
                        title: 'Amanuensis | Log in',
                        notification: {
                            severity: 'error',
                            message: 'Please enter the correct username and password.'
                        }
                    });
                }
                req.login(user, function(err) {
                    if (err) {
                        return next(err);
                    }
                    if (user) {
                        return res.redirect('/posts/my/');
                    }
                    else {
                        return res.redirect('/login');
                    }
                });
            })(req, res, next)
        });

    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    return router;
};