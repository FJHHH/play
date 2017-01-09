/**
 * Created by FJH on 2017/1/6.
 */
/**
 * Created by FJH on 2016/12/21.
 */
var sequelize = require('./dbPool');
var Sequelize  = require('sequelize');

var DailyTask = sequelize.define('DailyTask', {
    id : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        field : 'id',
        autoIncrement: true
    },
    taskName : {
        type : Sequelize.STRING,
        field : 'taskName'
    },
    taskDescription : {
        type : Sequelize.STRING,
        field : 'taskDescription'
    },
    addTime : {
        type :Sequelize.DATE,
        field : 'addTime'
    },
    endTime : {
        type: Sequelize.DATE,
        field: 'endTime'
    },
    status : {
        type : Sequelize.INTEGER,
        field: 'status'
    }

},{
    tableName: 'DailyTask'
});

DailyTask.sync();

module.exports = DailyTask;