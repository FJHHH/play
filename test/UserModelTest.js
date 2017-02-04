/**
 * Created by FJH on 2017/1/9.
 */
var User = require('../model/User');

User.create({
    userName: 'fjh',
    realName: 'fjh',
    password: '123',
    email: '123456@qq.com',
    status: 0
}).then(function (user) {
    console.log(user);
});