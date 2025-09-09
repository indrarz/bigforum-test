const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const User = db.define(
  "User",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    userUpdate: {
      type: DataTypes.STRING,
      defaultValue: "SYSTEM",
    },
  },
  {
    tableName: "user",
    timestamps: true,
  },
);

module.exports = User;
