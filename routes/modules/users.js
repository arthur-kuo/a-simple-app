const express = require('express');
const router = express.Router();
const {authenticated, authenticatedAdmin} = require('../../middleware/auth');
const passport = require('../../config/passport');
const {
  signUp,
  login,
  logout,
  getUserInfo,
  editUserInfo,
  editUserPassword,
  getUsers,
  getUsersStatistics,
} = require('../../controllers/user-controller');

router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', logout);
router.get('/dashboard', getUsers);
router.get('/dashboard/stats', authenticated, getUsersStatistics);
router.put('/:id/reset-password', authenticated, editUserPassword);
router.get('/:id', authenticated, getUserInfo);
router.put('/:id', authenticated, editUserInfo);

module.exports = router;
