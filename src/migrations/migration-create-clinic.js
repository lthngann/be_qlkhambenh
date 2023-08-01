"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("clinics", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING,
            },
            address: {
                type: Sequelize.STRING,
            },
            descriptionHTMLIntroduce: {
                type: Sequelize.TEXT,
            },
            descriptionMarkdownIntroduce: {
                type: Sequelize.TEXT,
            },
            descriptionHTMLStrengths: {
                type: Sequelize.TEXT,
            },
            descriptionMarkdownStrengths: {
                type: Sequelize.TEXT,
            },
            descriptionHTMLEquipment: {
                type: Sequelize.TEXT,
            },
            descriptionMarkdownEquipment: {
                type: Sequelize.TEXT,
            },
            descriptionHTMLLocation: {
                type: Sequelize.TEXT,
            },
            descriptionMarkdownLocation: {
                type: Sequelize.TEXT,
            },
            descriptionHTMLProcedure: {
                type: Sequelize.TEXT,
            },
            descriptionMarkdownProcedure: {
                type: Sequelize.TEXT,
            },
            image: {
                type: Sequelize.BLOB("long"),
            },
            logo: {
                type: Sequelize.BLOB("long"),
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("clinics");
    },
};
