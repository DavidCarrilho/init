'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('students', 'adaptacaoCompleta', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'JSON da adaptação completa gerada pela IA'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('students', 'adaptacaoCompleta');
  }
};