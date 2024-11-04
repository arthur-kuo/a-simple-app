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

module.exports = {login};
