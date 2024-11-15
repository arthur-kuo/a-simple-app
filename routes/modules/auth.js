const express = require('express');
const router = express.Router();

const passport = require('passport');

router.get('/google', passport.authenticate('google'));

router.get('/google/callback',
    passport.authenticate(
        'google',
        { 
          successRedirect: '/dashboard',
          failureRedirect: '/',
          failureMessage: true,
        },
    ),
    (req, res) => {
      res.status(200).json({message: 'Login successful', token});
    },
);

module.exports = router;
