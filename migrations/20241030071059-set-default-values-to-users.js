'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'is_verified', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });

    await queryInterface.changeColumn('Users', 'login_count', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    });

    await queryInterface.changeColumn('Users', 'last_session', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Reverting the changes if needed
    await queryInterface.changeColumn('Users', 'is_verified', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });

    await queryInterface.changeColumn('Users', 'login_count', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.changeColumn('Users', 'last_session', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },
};
