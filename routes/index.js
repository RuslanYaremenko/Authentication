var express = require('express');
var router = express.Router();
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

/* GET home page. */
router.get('/', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.render('index', {
      title: 'Members'
    });
    return next()
  }
  res.redirect('/users/login')

});



module.exports = router;