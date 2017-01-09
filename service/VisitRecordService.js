/**
 * Created by FJH on 2016/12/21.
 */
var VisitRecord = require('../model/VisitRecord');

var add = function (visitRecord, callback, transaction) {
    VisitRecord.create(visitRecord, transaction ? {
            transaction: transaction
        } : null).then(function (visitRecord) {
        // TODO
        callback(null, visitRecord);
    }).error(function (err) {
        callback(err, null);
    });
};

var update = function (visitRecord, callback, transaction) {
    VisitRecord.update(visitRecord, transaction ? {
            transaction: transaction
        } : null).then(function (result) {
        callback(null, result[0]);
    }).error(function (err) {
        callback(err, null);
    });
};

var page = function (callback, start, pageSize) {
    VisitRecord.findAndCountAll({
        where : {
        },
        offset : start,
        limit : pageSize
    }).then(function(result){
        callback(null, result.count, result.rows);
    }).error(function(err) {
        callback(err);
    });
};

module.exports = {
    add: add,
    update: update,
    page: page
};