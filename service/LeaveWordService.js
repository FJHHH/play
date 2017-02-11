/**
 * Created by FJH on 2017/2/4.
 */
var LeaveWord = require('../model/leaveword/LeaveWord');
var FunctionUtil = require('../util/FunctionUtil');

var add = function (leaveWord, callback) {
    var flag = FunctionUtil.isFunction(callback);
    LeaveWord.create(leaveWord).then(function(leaveWord) {
        if (flag) callback(null, leaveWord);
    }).error(function (err) {
        console.log(err);
        if (flag) callback(err);
    });
};

var page = function (callback, leaveWord, start, pageSize) {
    var flag = FunctionUtil.isFunction(callback);
    LeaveWord.findAndCountAll({
        where : leaveWord,
        offset : start,
        limit : pageSize,
        order : 'createdAt DESC'
    }).then(function (result) {
        if (flag) callback(null, result.count, result.rows);
    }).error(function (err) {
        if (flag) callback(err);
    });
};

module.exports = {
    add: add,
    page: page
};