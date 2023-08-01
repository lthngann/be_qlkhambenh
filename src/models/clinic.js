"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Clinic extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Clinic.init(
        {
            name: DataTypes.STRING,
            address: DataTypes.STRING,
            descriptionHTMLIntroduce: DataTypes.TEXT,
            descriptionMarkdownIntroduce: DataTypes.TEXT,
            descriptionHTMLStrengths: DataTypes.TEXT,
            descriptionMarkdownStrengths: DataTypes.TEXT,
            descriptionHTMLEquipment: DataTypes.TEXT,
            descriptionMarkdownEquipment: DataTypes.TEXT,
            descriptionHTMLLocation: DataTypes.TEXT,
            descriptionMarkdownLocation: DataTypes.TEXT,
            descriptionHTMLProcedure: DataTypes.TEXT,
            descriptionMarkdownProcedure: DataTypes.TEXT,
            image: DataTypes.STRING,
            logo: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Clinic",
        }
    );
    return Clinic;
};
