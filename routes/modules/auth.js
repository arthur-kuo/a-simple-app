const express = require('express');
const router = express.Router();

const passport = require('passport');

router.post('/google', passport.authenticate('google'));

router.get('/google/callback',
  passport.authenticate(
      'google',
      { session: false },
  ),
  (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.json({
      success: true,
      token: req.user.token,
      message: 'Google login successful'
    });
  }
);

module.exports = router;
