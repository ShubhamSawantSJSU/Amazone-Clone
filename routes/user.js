var router = require('express').Router();
var User = require('../models/user');
var passport = require('passport');
var passportConfig = require('../config/passport');

router.get('/login', function(req, res) {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('accounts/login', {message: req.flash('loginMessage')});
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/signup', function(req, res, next) {
  res.render('accounts/signup', {
    errors: req.flash('errors')
  });
});

router.post('/signup', function(req, res, next) {
  var user = new User();

  user.profile.name = req.body.name;
  user.password = req.body.password;
  user.email = req.body.email;

  User.findOne({ email: req.body.email}, function(err, existingUser) {
    req.flash('errors', 'Account with the email address already exists!!');

    if (existingUser) {
      return res.redirect('/signup');
    }
    else {
      user.save(function(err, user) {
        if (err) {
          return next(err);
        }

        return res.redirect('/');
      });
    }
  });
});

module.exports = router;
