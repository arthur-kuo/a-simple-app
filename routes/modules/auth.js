const express = require('express');
const router = express.Router();

const passport = require('passport');

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    const token = req.user.token;
    res.redirect(`/dashboard?token=${token}`);
  });


module.exports = router;
