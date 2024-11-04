const {User} = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const login = async (req, res, next) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({where: {email}});

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({
        error: 'Invalid email or password',
      });
    };
    if (!user || user.isAdmin == false) {
      return res.status(404).json({
        error: 'User not found',
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
    res.status(200).json({message: 'Login successful, hi admin', token});
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'name', 'createdAt', 'loginCount', 'lastSession'],
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
    const totalUsers = await User.count();

    // Users with active sessions today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeSessionsToday = await User.count({
      where: {lastSession: {[Op.gte]: today}},
    });

    // Average number of active sessions over the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    const activeSessionsLastWeek = await User.count({
      where: {lastSession: {[Op.gte]: sevenDaysAgo}},
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

module.exports = {login, getUsers, getUsersStatistics};
