const router = require('express').Router();
const user = require('../controller/userController');
const validateToken = require('../middleware/validateToken');

router.get('/me', validateToken(), user.getCurrentUser);
router.get('/:username', user.findByUsername);

module.exports = router;
