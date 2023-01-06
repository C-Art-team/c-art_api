'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Communities", [
      {
        name: "Sound Effect Communities",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Music Communities",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Visual Effect Communities",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Video Footage Communities",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "3D Model Communities",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Script Communities",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Image Asset Communities",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Communities', null, {})
  }
};
