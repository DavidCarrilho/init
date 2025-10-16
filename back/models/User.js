const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100], // Senha deve ter entre 6 e 100 caracteres
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [1, 100], // Nome deve ter entre 1 e 100 caracteres
    },
  },
  isFirstAccess: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

// Método para verificar senha
User.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Método para retornar dados seguros do usuário (sem senha)
User.prototype.toSafeObject = function() {
  const { id, email, name, isFirstAccess, createdAt, updatedAt } = this;
  return { id, email, name, isFirstAccess, createdAt, updatedAt };
};

module.exports = User;