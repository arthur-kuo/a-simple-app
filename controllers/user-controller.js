const {User} = require('../models');
const {sendVerificationEmail} = require('../helpers/email-helper');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const signUp = async (req, res, next) => {
  try {
    const {name, email, password, confirmPassword} = req.body;

    // Validate required fields
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({error: 'All fields are required.'});
    }
    if (name.length > 50) {
      return res.status(400).json({error: 'Name is too long.'});
    }

    const normalizedEmail = email.trim().toLowerCase();
    // Check for duplicate email registration
    const userEmail = await User.findOne({
      where: {email: normalizedEmail},
    });
    if (userEmail) {
      return res.status(400).json({
        error: 'Email is already registered.',
      });
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({error: 'Passwords do not match.'});
    }

    // Password format validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: 'Invalid password format. Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 8 characters long.',
      });
    }

    // Encrypt password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({email, password: hashedPassword, name});

    // Send verification email
    await sendVerificationEmail(user);
    res.status(201).json({
      message: 'Registration successful. Please verify your email.',
    });
  } catch (err) {
    next(err);
  }
};


const login = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({where: {email}});

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).send('Invalid email or password');
    }
    if (!user.isVerified) {
      return res.status(403).send('Please verify your email before logging in');
    }

    const token = jwt.sign(
        {userId: user.id},
        process.env.JWT_SECRET,
        {expiresIn: '1h'},
    );
    user.loginCount += 1;
    await user.save();
    res.cookie('token', token, {httpOnly: true, maxAge: 3600000});
    res.status(200).json({message: 'Login successful', token});
  } catch (error) {
    res.status(500).json({error: 'Internal server error.'});
  }
};

const logout = (req, res, next) => {
  try {
    res.clearCookie('token');
    return res.status(200).json({message: 'Logged out successfully'});
  } catch (err) {
    next(err);
  }
};

const emailVerification = async (req, res, next) => {
  try {
    const {token} = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(404).json({error: 'User not found'});
    };
    if (user.isVerified) {
      return res.status(400).json({error: 'User already verified'});
    };

    user.isVerified = true;
    await user.save();

    return res.status(200).json({message: 'Email verification successful'});
  } catch (err) {
    next(err);
  }
};


module.exports = {signUp, login, logout, emailVerification};
