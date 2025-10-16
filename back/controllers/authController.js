const { validationResult } = require('express-validator');
const authService = require('../services/authService');

class AuthController {
  // Registro de usuário
  async register(req, res, next) {
    try {
      // Verifica erros de validação
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;
      const result = await authService.register(email, password);
      
      res.status(201).json(result);
    } catch (error) {
      if (error.message === 'Email já está em uso') {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  // Login de usuário
  async login(req, res, next) {
    try {
      // Verifica erros de validação
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;
      const result = await authService.login(email, password);
      
      res.json(result);
    } catch (error) {
      if (error.message === 'Credenciais inválidas') {
        return res.status(401).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  // Verifica se usuário está autenticado
  async me(req, res) {
    res.json({
      success: true,
      user: req.user.toSafeObject()
    });
  }

  // Logout (invalidação do token seria feita no frontend)
  async logout(req, res) {
    res.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  }

  // Atualizar nome do usuário
  async updateName(req, res, next) {
    try {
      const userId = req.user.id;
      const { name } = req.body;
      
      if (!name || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Nome é obrigatório'
        });
      }

      const result = await authService.updateName(userId, name.trim());
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Renovar token
  async refreshToken(req, res, next) {
    try {
      const userId = req.user.id;
      const result = await authService.refreshToken(userId);
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Excluir conta do usuário
  async deleteAccount(req, res, next) {
    try {
      const userId = req.user.id;
      const result = await authService.deleteAccount(userId);
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();