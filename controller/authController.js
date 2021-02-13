const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const UserModel = require('../models/users');
const sendEmail = require('../utils/sendMail');
const authTokenGenerator = require('../utils/authTokenGenerator');
const toMilliseconds = require('../utils/toMilliseconds');

const sendVerificationEmail = (email, username, userid) => {
  const verificationToken = jwt.sign({}, process.env.JWT_SECRET, {
    expiresIn: '48h',
    audience: 'emailVerification',
    subject: userid,
  });

  return sendEmail({
    to: email,
    subject: 'Please confirm your email',
    template: 'emailVerification',
    token: verificationToken,
    username,
  });
};

const signup = async (req, res, next) => {
  try {
    const user = await UserModel.create(req.body);

    const sendEmailFlag = process.env.SEND_EMAIL_FLAG === 'true';
    if (sendEmailFlag) {
      sendVerificationEmail(user.email, user.username, user.id);
      // .catch((error) => logger.log);
    }

    const { accessToken, refreshToken } = await authTokenGenerator({
      userid: user.id,
      isAdmin: user.isAdmin,
      isEmailVerified: user.isEmailVerified,
      tokenVersion: user.tokenVersion,
    });

    return res
      .status(201)
      .cookie('refresh_token', refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: toMilliseconds(process.env.REFRESH_TOKEN_EXP), // convert to milliseconds
        secure: process.env.NODE_ENV === 'production',
      })
      .json({
        accessToken,
        status: 'success',
        payload: user,
      });
  } catch (error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      const key = Object.keys(error.keyValue)[0];
      return next(
        createError(
          400,
          `${key} with '${error.keyValue[key]}' is already registered`,
        ),
      );
    }
    return next(error);
  }
};

const resendVerificationEmail = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.query.email });
    if (user) {
      await sendVerificationEmail(user.email, user.username, user.id);
      return res.status(200).json({
        status: 'success',
        payload: {},
      });
    }
    return next(
      createError(400, 'User with the given email address does not exist.'),
    );
  } catch (err) {
    return next(err);
  }
};

const verifyemail = async (req, res, next) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
      audience: 'emailVerification',
    });

    const user = await UserModel.findById(decoded.sub);

    if (user.isEmailVerified) {
      return next(createError(400, 'User is already verified.'));
    }

    user.isEmailVerified = true;
    await user.save();

    return res.status(200).json({
      status: 'success',
      payload: user,
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(createError(400, 'Verification token expired.'));
    }

    if (err.name === 'invalid issuer' || err.name === 'JsonWebTokenError') {
      return next(createError(400, 'Invalid verification token.'));
    }

    return next(err);
  }
};

const isUsernameAvailable = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ username: req.params.username });

    return res.status(200).json({
      status: 'success',
      payload: {
        isAvailable: !user, // false if user exists, true if doesn't exist.
      },
    });
  } catch (err) {
    return next(err);
  }
};

const isEmailAvailable = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.params.email });

    return res.status(200).json({
      status: 'success',
      payload: {
        isAvailable: !user, // false if user exists, true if doesn't exist.
      },
    });
  } catch (err) {
    return next(err);
  }
};

const rotateToken = async (req, res, next) => {
  try {
    const token = req.cookies.refresh_token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
      audience: 'refresh',
    });

    const user = await UserModel.findById(decoded.sub);

    if (user.tokenVersion !== decoded.tokenVersion) {
      return next(createError(401, 'Invalid refresh token'));
    }

    const { accessToken, refreshToken } = await authTokenGenerator({
      userid: user.id,
      isAdmin: user.isAdmin,
      isEmailVerified: user.isEmailVerified,
      tokenVersion: user.tokenVersion,
    });

    return res
      .status(200)
      .cookie('refresh_token', refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: toMilliseconds(process.env.REFRESH_TOKEN_EXP), // convert to milliseconds
        secure: process.env.NODE_ENV === 'production',
      })
      .json({
        accessToken,
        status: 'success',
        payload: {},
      });
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

const login = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return next(createError(400, 'Invalid email or password'));
    }

    if (await user.passwordMatch(req.body.password)) {
      const { accessToken, refreshToken } = await authTokenGenerator({
        userid: user.id,
        isAdmin: user.isAdmin,
        isEmailVerified: user.isEmailVerified,
        tokenVersion: user.tokenVersion,
      });

      return res
        .status(200)
        .cookie('refresh_token', refreshToken, {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          maxAge: toMilliseconds(process.env.REFRESH_TOKEN_EXP), // convert to milliseconds
          secure: process.env.NODE_ENV === 'production',
        })
        .json({
          accessToken,
          status: 'success',
          payload: user,
        });
    }
    return next(createError(400, 'Invalid Email or Password'));
  } catch (error) {
    return next(error);
  }
};

const logout = async (req, res) => {
  res.clearCookie('refresh_token').json({
    status: 'success',
    payload: {},
  });
};

module.exports = {
  signup,
  resendVerificationEmail,
  verifyemail,
  isUsernameAvailable,
  isEmailAvailable,
  rotateToken,
  login,
  logout,
};
