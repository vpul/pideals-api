const jwt = require('jsonwebtoken');

const tokenGenerator = (audience, subject, payload) => {
  return jwt.sign(payload || {}, process.env.JWT_SECRET, {
    expiresIn:
      audience === 'access'
        ? process.env.ACCESS_TOKEN_EXP
        : process.env.REFRESH_TOKEN_EXP,
    audience,
    subject,
  });
};

const authTokenGenerator = async ({ userid, tokenVersion, ...payload }) => {
  const accessToken = tokenGenerator('access', userid, payload);
  const refreshToken = tokenGenerator('refresh', userid, { tokenVersion });
  return {
    accessToken,
    refreshToken,
  };
};

module.exports = authTokenGenerator;
