const User = require('../models/user');

const emailVerified = async (req, res, next) => {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    console.log('user:', user)
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.emailVerified) {
      return res.status(400).json({ error: 'Email not verified' });
    }
    next();
};

module.exports = {
  emailVerified,
};