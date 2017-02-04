/**
 * Created by FJH on 2017/1/9.
 */
var DailyTask = require("../model/task/DailyTask");

var pageAll = function (callback, start, pageSize, userid) {
    DailyTask.findAndCountAll({
        where : {
        },
        offset : start,
        limit : pageSize
    }).then(function(result) {
        callback(null, result.count, result.rows);
    }).error(function (err) {
        callback(err);
    });
};

var add = function (dailyTask, callback) {
    DailyTask.create(dailyTask).then(function(dailyTask) {
        callback(err, dailyTask);
    }).error(function (err) {
        callback(err);
    });
};

var update = function (dailyTask, callback) {

};

module.exports = {
    add : add,
    update : update,
    pageAll : pageAll
};