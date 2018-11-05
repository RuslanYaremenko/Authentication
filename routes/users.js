var express = require('express');
var router = express.Router();
const multer = require('multer')
const upload = multer({
  dest: './uploads'
})
const User = require('../models/user')

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

module.exports = router;