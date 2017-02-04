/**
 * Created by FJH on 2017/1/9.
 */
var User = require('../model/User');

var add = function (user, callback) {
    User.create(user).then(function (user) {
        if (callback)
            callback(null, user);
    }).error(function (err) {
        if (callback)
            callback(err);
    });
};

var login = function (user, callback) {
    User.findOne({where: {email: user.email, password: user.password}}).then(function (user) {
        callback(null, user.dataValues);
    }).error(function (err) {
        callback(err);
    });
};

var findCount = function (user, callback) {

};

var checkEmail = function (email, callback) {
    User.findAll({
        where: {
            email: email
        }
    }).then(function (result) {
        callback(null, result.length <= 0);
    }).error(function (err) {
        callback(err);
    });
};

var checkUserName = function (userName, callback) {
    User.findAll({
        where: {
            userName: userName
        }
    }).then(function (result) {
        callback(null, result.length <= 0);
    }).error(function (err) {
        callback(err);
    });
};

module.exports = {
    login: login,
    add: add,
    checkUserName: checkUserName,
    checkEmail: checkEmail
};