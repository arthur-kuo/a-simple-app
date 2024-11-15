const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local');
const {User} = require('../models');
// const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
},
async (req, email, password, done) => {
  try {
    const user = await User.findOne({where: {email}});

    if (!user) {
      return done(null, false, {message: 'Invalid email or password'});
    }

    if (user.isAdmin) {
      return done(null, false, {message: 'User not found'});
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return done(null, false, {message: 'Invalid email or password'});
    }

    if (!user.isVerified) {
      return done(null, false, {message: 'Please verify your email before logging in'});
    }

    user.loginCount += 1;
    user.lastSession = new Date();
    await user.save();

    // const token = jwt.sign(
    //     {userId: user.id},
    //     process.env.JWT_SECRET,
    //     {expiresIn: '1h'},
    // );

    // user.token = token;

    return done(null, user);
  } catch (err) {
    return done(err);
  }
},
));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GGcallbackURL,
  scope: ['email', 'profile'],
  state: true,
}, async (accessToken, refreshToken, profile, done) => {

    if (!profile.emails || profile.emails.length === 0) {
      return done(new Error('Email not found in Google profile'));
    }
    
    const { name, email } = profile._json;
    console.log(name, email)
    let user = await User.findOne({ where: { email } });
    
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashPassword = await bcrypt.hash(randomPassword, 10);
      
      user = await User.create({
        name,
        email,
        password: hashPassword,
        isVerified: true,
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    user.token = token;
    return done(null, user);


}));

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findByPk(id).then((user) => {
    user = user.toJSON();
    return cb(null, user);
  });
});

module.exports = passport;
