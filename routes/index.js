const users = require('./modules/users');
const auth = require('./modules/auth');
const express = require('express');
const router = express.Router();

// for back-end endpoint
router.use('/api/users', users);
router.use('/api/auth', auth);

// for front-end
router.get('/dashboard', (req, res) => {
  // #swagger.ignore = true
  res.render('dashboard', {user: req.user, stats: req.stats});
});
router.get('/email-verification', (req, res) => {
  // #swagger.ignore = true
  res.render('email-verification')
});
router.get('/', (req, res)=>{
  // #swagger.ignore = true
  res.render('auth');
  // res.send('Hello World');
}); 

module.exports = router;
