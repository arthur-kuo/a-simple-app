const User = require('../models/user');
const {sendVerificationEmail} = require('../helpers/email-helper');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const {Op} = require('sequelize');
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const config = require(path.resolve(__dirname, '../config/config.json'))[env];


const signUp = async (req, res, next) => {
  console.log('config666:', config)
  console.log(env)

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
        error: 'Invalid password format.' +
         'Password must contain at least one lowercase letter,' +
         'one uppercase letter,' +
         'one digit,'+
         'one special character,' +
         'and be at least 8 characters long.',
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


const login = async (req, res, next) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({where: {email}});

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({
        error: 'Invalid email or password',
      });
    };
    if (!user || user.isAdmin == true) {
      return res.status(404).json({
        error: 'User not found',
      });
    };
    if (!user.isVerified) {
      return res.status(403).json({
        error: 'Please verify your email before logging in',
      });
    };

    const token = jwt.sign(
        {userId: user.id},
        process.env.JWT_SECRET,
        {expiresIn: '1h'},
    );
    user.loginCount += 1;
    user.lastSession = new Date();
    await user.save();
    res.cookie('token', token, {httpOnly: true, maxAge: 3600000});
    res.status(200).json({message: 'Login successful', token});
  } catch (err) {
    next(err);
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

const getUserInfo = async (req, res, next) => {
  try {
    const userInfo = await User.findOne({
      where: {id: req.params.id},
      attributes: ['id', 'name', 'email'],
    });
    if (!userInfo || userInfo.isAdmin == true) {
      return res.status(404).json({
        error: 'User not found',
      });
    };
    return res.status(200).json(userInfo);
  } catch (err) {
    next(err);
  }
};

const editUserInfo = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const {name} = req.body;

    if (!name || name.length > 50) {
      return res.status(400).json({
        error: 'Invalid name.' +
        'Name must be provided and less than 50 characters.',
      });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }
    user.name = name;
    await user.save();
    return res.status(200).json({
      message: 'User name updated successfully',
      user: {id: user.id, name: user.name, email: user.email},
    });
  } catch (err) {
    next(err);
  }
};

const editUserPassword = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const {oldPassword, newPassword, confirmPassword} = req.body;

    // Check required fields
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        error: 'All password fields are required.',
      });
    }

    // Find the user by ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({error: 'Old password is incorrect'});
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({error: 'New passwords do not match'});
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        error: 'Invalid password format.' +
         'Password must contain at least one lowercase letter,' +
         'one uppercase letter,' +
         'one digit,'+
         'one special character,' +
         'and be at least 8 characters long.',
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({message: 'Password updated successfully'});
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: [
        'id',
        'email',
        'name',
        'createdAt',
        'loginCount',
        'lastSession',
      ],
      where: {isAdmin: false},
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

const getUsersStatistics = async (req, res, next) => {
  try {
    // Total number of users
    const totalUsers = await User.count({
      where: {isAdmin: false},
    });

    // Users with active sessions today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeSessionsToday = await User.count({
      where: {
        lastSession: {[Op.gte]: today},
        isAdmin: false,
      },
    });

    // Average number of active sessions over the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    const activeSessionsLastWeek = await User.count({
      where: {
        lastSession: {[Op.gte]: sevenDaysAgo},
        isAdmin: false,
      },
    });
    const avgActiveSessions = (activeSessionsLastWeek / 7).toFixed(2);

    res.status(200).json({
      totalUsers,
      activeSessionsToday,
      avgActiveSessions,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signUp,
  login,
  logout,
  emailVerification,
  getUserInfo,
  editUserInfo,
  editUserPassword,
  getUsers,
  getUsersStatistics,
};
