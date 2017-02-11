/**
 * Created by FJH on 2017/2/4.
 */
var sequelize = require('../dbPool');
var Sequelize = require('sequelize');

var LeaveWord = sequelize.define('LeaveWord', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        field: 'id',
        autoIncrement: true
    },
    // 为用户预留
    userId: {
        type: Sequelize.INTEGER,
        field: 'userId'
    },
    word: {
        type: Sequelize.STRING,
        field: 'word',
        allowNull: false
    },
    IP: {
        type: Sequelize.STRING,
        field: 'IP'
    },
    email: {
        type: Sequelize.STRING,
        field: 'email'
    },
    nickName: {
        type: Sequelize.STRING,
        field: 'nickname'
    },
    status: {
        type: Sequelize.INTEGER,
        field: 'status',
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'LeaveWord'
});

LeaveWord.sync();

module.exports = LeaveWord;