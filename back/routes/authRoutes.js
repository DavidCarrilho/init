const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../validators/authValidator');

const router = express.Router();

// POST /api/auth/register - Registrar novo usuário
router.post('/register', registerValidation, authController.register);

// POST /api/auth/login - Login do usuário
router.post('/login', loginValidation, authController.login);

// GET /api/auth/me - Obter dados do usuário autenticado
router.get('/me', authenticateToken, authController.me);

// POST /api/auth/logout - Logout do usuário
router.post('/logout', authenticateToken, authController.logout);

// PUT /api/auth/update-name - Atualizar nome do usuário
router.put('/update-name', authenticateToken, authController.updateName);

// POST /api/auth/refresh-token - Renovar token
router.post('/refresh-token', authenticateToken, authController.refreshToken);

// DELETE /api/auth/delete-account - Excluir conta do usuário
router.delete('/delete-account', authenticateToken, authController.deleteAccount);

module.exports = router;