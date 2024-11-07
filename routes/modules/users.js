const express = require('express');
const router = express.Router();
const {authenticated, authenticatedAdmin} = require('../../middleware/auth');
const passport = require('../../config/passport');
const {
  signUp,
  login,
  logout,
  emailVerification,
  getUserInfo,
  editUserInfo,
  editUserPassword,
  getUsers,
  getUsersStatistics,
} = require('../../controllers/user-controller');

router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', logout);
router.get('/emailVerification', emailVerification); // "when I send the same request twice, does this make a different state on server?
router.get('/dashboard', authenticated, getUsers);
router.get('/dashboard/stats', authenticated, getUsersStatistics);
router.put('/:id/reset-password', authenticated, editUserPassword);
router.get('/:id', authenticated, getUserInfo);
router.put('/:id', authenticated, editUserInfo);

module.exports = router;
