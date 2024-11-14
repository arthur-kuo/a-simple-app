const helpers = require('../helpers/auth-helpers');
const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    return next();
  }
  // res.redirect('/signin')
  res.status(401).json({status: 'error', message: 'Unauthorized'});
};

module.exports = {
  authenticated,
};
