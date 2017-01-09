/**
 * Created by FJH on 2016/12/22.
 */
var Sequelize  = require('sequelize');
var sequelize = new Sequelize('fjh_play_visit', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

module.exports = sequelize;