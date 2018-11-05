var express = require('express');
var router = express.Router();
const multer = require('multer')
const upload = multer({
  dest: './uploads'
})

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
    const profileimage = req.file.filename
  } else {
    console.log('No file uploaded...')
    const profileimage = 'noimage.jpg'
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
    console.log('No Errors')
  }
});

module.exports = router;