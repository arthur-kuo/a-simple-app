const {ensureAuthenticated} = require('../helpers/auth-helpers');
const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' })
    }
    req.user = user // JWT 沒有使用 session，所以需要手動設置
    return next()
  })(req, res, next)
}

module.exports = {
  authenticated,
};
