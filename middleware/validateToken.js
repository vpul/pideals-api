const jwt = require('jsonwebtoken');

module.exports = (params) => {
  const { optionalAuth = false } = params || {}; // ES6 destructuring doesn't work with undefined

  return async (req, res, next) => {
    try {
      const authorizationHeader = req.headers.authorization;

      // if authorization is optional and auth
      // header is not provided, directly return next()
      if (optionalAuth && !authorizationHeader) {
        return next();
      }

      const token =
        authorizationHeader && authorizationHeader.split('Bearer ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ['HS256'],
        audience: 'access',
      });

      res.locals = decoded;
      return next();
    } catch (error) {
      if (
        error.name === 'TokenExpiredError' ||
        error.name === 'JsonWebTokenError'
      ) {
        error.status = 401;
      }
      return next(error);
    }
  };
};
