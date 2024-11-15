const express = require('express');
const router = express.Router();

const passport = require('passport');

router.post('/google', passport.authenticate('google'));

router.get('/google/callback',
    passport.authenticate(
        'google',
        { 
          successRedirect: '/dashboard',
          successMessage: true,
          failureRedirect: '/',
          failureMessage: true,
        },
    )
);

module.exports = router;
