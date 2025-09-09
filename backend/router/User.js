const { Router } = require('express');
const user = require('../controller/user');
const { authenticateToken } = require('../middleware/jwt');
const { verifyRole } = require('../middleware/role_verification');

const router = Router();

router.get('/', authenticateToken, verifyRole('user'), user.getAll);
router.get('/:id', authenticateToken, verifyRole('user'), user.getOne);
router.post('/create', user.create);
router.post('/edit/:id', authenticateToken, verifyRole('user'), user.update);
router.post('/delete/:id', authenticateToken, verifyRole('user'), user.delete);

module.exports = router;
