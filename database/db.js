const Sequelize = require("sequelize");
const db = {};
const sequelize = new Sequelize("linux", "root", "1q2w3e4r", {
    host: '118.27.12.220',
    dialect: 'mysql',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;