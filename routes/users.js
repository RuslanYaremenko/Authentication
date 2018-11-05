var express = require('express');
var router = express.Router();
const multer = require('multer')
const upload = multer({
  dest: './uploads'
})
const User = require('../models/user')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resoursce');
});
router.get('/register', (req, res, next) => {
  res.render('register', {
    title: 'Register'
  });
});
router.get('/login', (req, res, next) => {
  res.render('login', {
    title: 'Login'
  });
});
router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: 'Invalid username or password'
  }),
  (req, res) => {
    req.flash('success', 'You are now logged in')
    res.redirect('/');
  })

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(new LocalStrategy((username, password, done) => {
  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return done(null, false, {
        message: 'Unknown User'
      })
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) return done(err);
      if (isMatch) {
        return done(null, user)
      } else {
        done(null, false, {
          message: 'Invalid Password'
        })
      }
    })
  })
}))

router.post('/register', upload.single('profileimage'), (req, res, next) => {
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password
  const username = req.body.username
  const password2 = req.body.password2

  if (req.file) {
    console.log('Uploading file...')
    var profileimage = req.file.filename
  } else {
    console.log('No file uploaded...')
    var profileimage = 'noimage.jpg'
  }

  //Form Validator
  req.checkBody('name', 'Name field is required').notEmpty()
  req.checkBody('email', 'Email field is required').notEmpty()
  req.checkBody('email', 'Email is not valid').isEmail()
  req.checkBody('password', 'Name field is required').notEmpty()
  req.checkBody('username', 'Userame field is required').notEmpty()
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password)

  //Check Errors
  const errors = req.validationErrors()

  if (errors) {
    res.render('register', {
      errors: errors
    })
  } else {
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      profileimage: profileimage
    })

    User.createUser(newUser, (err, user) => {
      if (err) {
        throw err
      }
      console.log(user)
    })
    req.flash('success', 'You are now registered and can login')
    res.location('/')
    res.redirect('/')
  }
});


router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success', 'You are now logged out')
  res.redirect('/users/login')
})
module.exports = router;