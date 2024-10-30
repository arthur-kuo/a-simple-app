const express = require('express');
const router = express.Router();
const {
  signUp,
  login,
  googleOAuthCallback,
} = require('../../controllers/user-controller');

router.post('/signup', signUp);
// router.post('/login', login);
// router.get('/google/callback', googleOAuthCallback);

module.exports = router;
