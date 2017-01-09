/**
 * Created by FJH on 2016/12/21.
 */
var sequelize = require('./dbPool');
var Sequelize  = require('sequelize');

var VisitRecord = sequelize.define('VisitRecord', {
    id : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        field : 'id',
        autoIncrement: true
    },
    host : {
        type : Sequelize.STRING,
        field : 'host'
    },
    pathname : {
        type : Sequelize.STRING,
        field : 'pathname'
    },
    visitTime : {
        type : Sequelize.DATE,
        field : 'visitTime'
    },
    visitLastS : {
        type : Sequelize.INTEGER,
        field : 'visitLastS'
    },
    visiterIPV4 : {
        type : Sequelize.STRING,
        field : 'visiterIPV4'
    },
    visiterIPV6 : {
        type : Sequelize.STRING,
        field : 'visiterIPV6'
    },
    httpHead : {
        type : Sequelize.STRING,
        field : 'httpHead'
    }
},{
    tableName: 'visitRecord',
    timestamps: false
});

module.exports = VisitRecord;