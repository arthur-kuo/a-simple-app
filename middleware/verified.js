const User = require('../models/user'); // Adjust based on your model

const emailVerified = async (req, res, next) => {
  console.log(req)
    const userId = req.user.userId; // Access the userId from the decoded token

    const user = await User.findById(userId);
    console.log(req)
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.emailVerified) {
      return res.status(400).json({ error: 'Email not verified' });
    }

    next(); // Proceed to the next middleware (getUsers)

};

module.exports = {
  emailVerified,
};