const express = require('express');
const router = express.Router();

const passport = require('passport');

router.get('/google', passport.authenticate('google'));

router.get('/google/callback',
    passport.authenticate(
        'google',
        { 
          failureRedirect: '/',
          failureMessage: true,
        },
    ),
    (req, res) => {
      console.log(req)
      return res.redirect('login success');
    },
);

module.exports = router;
