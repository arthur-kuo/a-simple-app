const express = require('express');
const router = express.Router();
const {
  signUp,
  login,
  logout,
  getUserInfo,
} = require('../../controllers/user-controller');

router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', logout);
router.get('/:id', getUserInfo);
// router.put('/:id', editUserInfo);
// router.put('/:id/reset-password', editUserPassword);

module.exports = router;
