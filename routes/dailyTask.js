/**
 * Created by FJH on 2017/1/9.
 */
var express = require('express');
var router = express.Router();
var service = require('../service/DailyTaskService');
var PageBean = require('../util/PageBean');

/* GET home page. */
router.get('/', function(req, res, next) {
    var currentPage = parseInt(req.param('currentPage') || 0);
    var pageSize = parseInt(req.param('pageSize') || 0);
    var pageBean = new PageBean();
    service.pageAll(function(err, count, rows){
        pageBean.setAllCount(count);
        pageBean.setArray(rows);
        res.render('dailytask/index', { title: 'task', pageBean: pageBean});
    },pageBean.getStart(), pageSize);
});
module.exports = router;