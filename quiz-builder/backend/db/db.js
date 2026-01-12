const { Sequelize } = require("sequelize");
require("dotenv").config();

const storage = process.env.DB_STORAGE || "./dev.sqlite";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage,
  logging: false,
});

module.exports = { sequelize };
