const jwt = require('jsonwebtoken');
const { User } = require('../models');

class AuthService {
  // Gera token JWT
  generateToken(userId) {
    return jwt.sign(
      { userId }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' } // TODO: Alterar tempo de expiração do token aqui se necessário
    );
  }

  // Registra novo usuário
  async register(email, password) {
    try {
      // Verifica se usuário já existe
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('Email já está em uso');
      }

      // Cria novo usuário
      const user = await User.create({ email, password });
      
      // Gera token
      const token = this.generateToken(user.id);

      return {
        success: true,
        message: 'Usuário criado com sucesso',
        user: user.toSafeObject(),
        token
      };
    } catch (error) {
      throw error;
    }
  }

  // Login do usuário
  async login(email, password) {
    try {
      // Busca usuário por email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('Credenciais inválidas');
      }

      // Verifica senha
      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        throw new Error('Credenciais inválidas');
      }

      // Gera token
      const token = this.generateToken(user.id);

      return {
        success: true,
        message: 'Login realizado com sucesso',
        user: user.toSafeObject(),
        token
      };
    } catch (error) {
      throw error;
    }
  }

  // Verifica token e retorna dados do usuário
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.userId);
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return {
        success: true,
        user: user.toSafeObject()
      };
    } catch (error) {
      throw error;
    }
  }

  // Atualizar nome do usuário
  async updateName(userId, name) {
    try {
      const user = await User.findByPk(userId);
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      user.name = name;
      user.isFirstAccess = false; // Marca que não é mais primeiro acesso
      await user.save();

      return {
        success: true,
        message: 'Nome atualizado com sucesso',
        user: user.toSafeObject()
      };
    } catch (error) {
      throw error;
    }
  }

  // Renovar token (refresh token)
  async refreshToken(userId) {
    try {
      const user = await User.findByPk(userId);
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Gera novo token
      const newToken = this.generateToken(user.id);

      return {
        success: true,
        message: 'Token renovado com sucesso',
        user: user.toSafeObject(),
        token: newToken
      };
    } catch (error) {
      throw error;
    }
  }

  // Excluir conta do usuário
  async deleteAccount(userId) {
    try {
      const user = await User.findByPk(userId);
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      await user.destroy();

      return {
        success: true,
        message: 'Conta excluída com sucesso'
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();