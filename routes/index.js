const users = require('./modules/users');
const admin = require('./modules/admin');
const auth = require('./modules/auth');
const express = require('express');
const router = express.Router();

// for back-end endpoint
router.use('/api/users', users);
router.use('/api/auth', auth);

// for front-end
router.get('/', (req, res)=>{
  res.render('auth');
});
router.get('/dashboard', (req, res) => {
  res.render('dashboard', { user: req.user, stats: req.stats });
});
router.get('/email-verification', (req, res) => res.render('email-verification'));

module.exports = router;
