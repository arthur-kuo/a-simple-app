const users = require('./modules/users');
const express = require('express');
const router = express.Router();


router.use('/api/users', users);
router.get('/', (req, res)=>{
  res.send('Hello World!');
});
module.exports = router;
