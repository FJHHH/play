/**
 * Created by FJH on 2017/2/4.
 */
var express = require('express');
var router = express.Router();
var moment = require('moment');
var service = require('../service/LeaveWordService');
var PageBean = require('../util/PageBean');
var format = 'YYYY-MM-DD HH:mm:ss';

router.post('/add', function (req, res, next) {
    var ip = req.headers['x-iisnode-remote_addr'] || req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    var email = req.param('email');
    var word = req.param('word');
    var nickname = req.param('nickname');

    if (!email.match(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/)) {
        res.json({
            result: false,
            msg: 'email格式错误'
        });
    } else if (!word || word === '') {
        res.json({
            result: false,
            msg: '留言内容不能为空'
        });
    } else if (!nickname || nickname === '') {
        res.json({
            result: false,
            msg: 'nickname内容不能为空'
        });
    } else {
        service.add({
            IP: ip,
            email: email,
            word: word,
            nickName: nickname
        }, function (err, leaveWord) {
            if (err) {
                res.json({
                    result: false,
                    msg: '出错了！'
                });
            } else {
                var createdTime = moment(leaveWord.createdAt).format(format);
                res.json({
                    result: true,
                    msg: '成功！',
                    leaveWord: leaveWord,
                    createdTime: createdTime
                });
            }
        });
    }
});

router.get('/', function (req, res, next) {
    res.render('leaveword/index');
});

router.get('/page', function (req, res, next) {
    var currentPage = parseInt(req.param('currentPage') || 1);
    var pageSize = parseInt(req.param('pageSize') || 10);
    var pageBean = new PageBean(currentPage, pageSize);
    service.page(function (err, count, rows) {
        pageBean.setAllCount(count);
        pageBean.setArray(rows);
        rows.forEach(function (item) {
            item.createdTime = moment(item.createdAt).format(format);
        });
        res.render('leaveword/page', {pageBean: pageBean});
    }, {status: 0}, pageBean.getStart(), pageSize);
});

module.exports = router;