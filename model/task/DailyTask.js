/**
 * Created by FJH on 2017/1/6.
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('DailyTask', {
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            field : 'id',
            autoIncrement: true
        },
        taskName : {
            type : DataTypes.STRING,
            field : 'taskName'
        },
        taskDescription : {
            type : DataTypes.STRING,
            field : 'taskDescription'
        },
        addTime : {
            type :DataTypes.DATE,
            field : 'addTime'
        },
        endTime : {
            type: DataTypes.DATE,
            field: 'endTime'
        },
        status : {
            type : DataTypes.INTEGER,
            field: 'status'
        }
    },{
        tableName: 'DailyTask'
    });
};