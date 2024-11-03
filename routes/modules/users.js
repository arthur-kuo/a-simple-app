const express = require('express');
const router = express.Router();
const {
  signUp,
  login,
  logout,
  getUserInfo,
  editUserInfo,
  editUserPassword,
} = require('../../controllers/user-controller');

router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', logout);
router.put('/:id/reset-password', editUserPassword);
router.get('/:id', getUserInfo);
router.put('/:id', editUserInfo);

module.exports = router;
