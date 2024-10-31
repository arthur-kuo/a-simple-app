const express = require('express');
const router = express.Router();

const passport = require('passport');

router.get('/google', passport.authenticate('google'));

router.get('/google/callback',
    passport.authenticate(
        'google',
        {
          failureRedirect: '/login',
          failureMessage: true,
        },
    ),
    (req, res) => {
      res.redirect('/');
    },
);

module.exports = router;
