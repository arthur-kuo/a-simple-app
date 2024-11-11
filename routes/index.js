const users = require('./modules/users');
const admin = require('./modules/admin');
const auth = require('./modules/auth');
const express = require('express');
const router = express.Router();


router.use('/api/users', users);
router.use('/auth', auth);
router.get('/', (req, res)=>{
  res.send('Hello World!');
});
module.exports = router;
