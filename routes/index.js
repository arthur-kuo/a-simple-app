const users = require('./modules/users');
const admin = require('./modules/admin');
const express = require('express');
const router = express.Router();


router.use('/api/users', users);
router.use('/api/admin', admin);
router.get('/', (req, res)=>{
  res.send('Hello World!');
});
module.exports = router;
