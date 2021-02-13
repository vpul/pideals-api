const router = require('express').Router();
const cookieParser = require('cookie-parser');
const validateSignup = require('../middleware/signupValidator');
const {
  signup,
  isUsernameAvailable,
  isEmailAvailable,
  resendVerificationEmail,
  verifyemail,
  rotateToken,
  login,
  logout,
} = require('../controller/authController');

router.post('/signup', validateSignup, signup);
router.get('/signup/confirm/resend', resendVerificationEmail);
router.get('/signup/confirm/:token', verifyemail);
router.get('/isavailable/username/:username', isUsernameAvailable);
router.get('/isavailable/email/:email', isEmailAvailable);
router.get('/rotatetoken', cookieParser(), rotateToken);
router.post('/login', login);
router.get('/logout', logout);

module.exports = router;
