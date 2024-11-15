const express = require('express');
const router = express.Router();

const passport = require('passport');

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = req.user.token;
    return res.status(200).json({message: 'Login successful', token, isVerified: true});
  });


module.exports = router;
