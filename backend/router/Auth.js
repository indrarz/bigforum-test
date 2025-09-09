const { Router } = require('express');
const Auth = require('../controller/auth');

const router = Router();

router.post('/login', Auth.login);
router.post('/logout', Auth.logout);

module.exports = router;