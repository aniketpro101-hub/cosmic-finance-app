/**
 * Admin Authentication & 2FA Enforcement Middleware
 */

const CONSTANTS = require('../config/constants');

function requireAdminAuth(req, res, next) {
  if (req.session && req.session.isAdminAuthenticated === true) {
    return next();
  }

  // If this is an API call under the admin route, return 401 JSON
  if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
    return res.status(401).json({ error: 'Unauthorized administrative access.' });
  }

  // Redirect strictly to the hidden admin login path
  return res.redirect(CONSTANTS.ADMIN_PATH + '/login');
}

module.exports = {
  requireAdminAuth
};
