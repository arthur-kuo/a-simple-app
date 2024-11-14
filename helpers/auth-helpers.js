const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return false;

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) return false;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {id: decoded.userId};
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  ensureAuthenticated,
};
