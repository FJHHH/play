/**
 * Created by FJH on 2016/12/22.
 */
var Sequelize  = require('sequelize');
var dbconfig = require('./config/dbconfig');
var sequelize = new Sequelize(dbconfig.database, dbconfig.username, dbconfig.password, {
    host: dbconfig.host,
    dialect: dbconfig.dialect,
    pool: {
        max: dbconfig.pool.max,
        min: dbconfig.pool.min,
        idle: dbconfig.pool.idle
    }
});

module.exports = sequelize;