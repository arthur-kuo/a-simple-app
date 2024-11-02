const express = require('express');
const router = express.Router();
const {
  signUp,
  login,
  logout,
} = require('../../controllers/user-controller');

router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', logout);
// router.get('/:id', getUserInfo);
// router.post('/:id', editUserInfo);
// =router.post('/:id', editProfile);

module.exports = router;
