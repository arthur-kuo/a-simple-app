const {User} = require('../models');
// const {sendVerificationEmail} = require('../utils/emailService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const signUp = async (req, res) => {
  try {
    const {name, email, password, confirmPassword} = req.body;
    if (!name || !email || !password || !confirmPassword) throw new Error('All fields are required');
    if (name.length > 50) throw new Error('Name is too long');
    const userEmail = await User.findOne({where: {email}});

    // Check if the password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).send('Passwords do not match');
    }

    // Password validation regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).send(
          'Invalid password format. Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 8 characters long',
      );
    }

    // const user = await User.create({email, password, name});
    // await sendVerificationEmail(user); // use SendGrid
    res.status(201).send('Registration successful, please verify your email');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};


const login = async (req, res) => {

};

const googleAuth = async (req, res) => {
  // Handle Google OAuth callback
};

const emailVerification = async (req, res) => {
  // Use SendGrid to send verification emails
};

module.exports = {signUp, login, googleAuth, emailVerification};
