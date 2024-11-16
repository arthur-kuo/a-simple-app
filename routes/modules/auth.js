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
          session: true
        },
    ),
    (req, res) => {
      res.header('Access-Control-Allow-Origin', process.env.APP_URL);
      res.header('Access-Control-Allow-Credentials', 'true');
      
      const token = generateToken(req.user);
      res.redirect(`${process.env.APP_URL}/dashboard?token=${token}`);
    }
);

module.exports = router;
