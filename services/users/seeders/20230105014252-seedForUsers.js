'use strict';
const { hashPassword } = require('../helpers/')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        email: "kibuellyoi34@gmail.com",
        password: hashPassword("123456"),
        username: "kibuelll",
        preference: "3D Model",
        address: "Jakarta",
        phoneNumber: "08123456789",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: "tonni.lius26@gmail.com",
        password: hashPassword("123456"),
        username: "dodol26",
        preference: "Image Asset",
        address: "Jakarta",
        phoneNumber: "08987654321",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
