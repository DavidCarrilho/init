const User = require('./User');
const Student = require('./Student');

// Associações entre modelos
User.hasMany(Student, { foreignKey: 'userId', as: 'students' });
Student.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  User,
  Student,
};