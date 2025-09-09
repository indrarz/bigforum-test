const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const { NotFoundError, WrongIdentityError } = require('../error');
const { response } = require('../middleware/bcrypt');

const blacklist = [];

module.exports = {
  // token signature authentication middleware by secret code
  authenticateToken: (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      // create locals variable to pass it to next middleware
      res.locals.token = authHeader && authHeader.split(' ')[1];
      if (res.locals.token == null) throw new NotFoundError('Access denied.');

      if (blacklist.includes(res.locals.token)) {
        throw new WrongIdentityError("Access denied.");
      }
      // verify the signature
      jwt.verify(
        res.locals.token,
        process.env.ACCESS_JWT_SECRET,
        (err, user) => {
          if (err)
            throw new WrongIdentityError(
              "Access denied."
            );
          req.user = user;
          next();
        }
      );
    } catch (error) {
      if (error.name === 'NotFoundError')
        return response(res, {
          code: 401,
          success: false,
          message: error.message,
        });

      if (error.name === 'WrongIdentityError')
        return response(res, {
          code: 403,
          success: false,
          message: error.message,
        });
    } finally {
      next();
    }
  },
  // decode payload jwt to get user data
  parseJwtPayload: (token) => {
    return jwt_decode(token);
  },
  // generate new jwt token which expires in 1 hour
  generateAccessToken: (user) => {
    return jwt.sign(user, process.env.ACCESS_JWT_SECRET, { expiresIn: '1h' });
  },
  // Logout and add token to blacklist
  blacklistToken: (token) => {
    blacklist.push(token); // add the token to blacklist
  },
};