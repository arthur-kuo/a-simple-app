const users = require('./modules/users');
const auth = require('./modules/auth');
const express = require('express');
const router = express.Router();

// for back-end endpoint
router.use('/api/users', users);
router.use('/api/auth', auth);

// for front-end

router.get('/dashboard', (req, res) => {
  res.render('dashboard', {user: req.user, stats: req.stats});
  // #swagger.ignore = true
});
router.get('/email-verification', (req, res) => {
  res.render('email-verification')
  // #swagger.ignore = true
});
router.get('/', (req, res)=>{
  res.render('auth');
  // #swagger.ignore = true
}); 
  

module.exports = router;
