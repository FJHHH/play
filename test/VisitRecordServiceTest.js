/**
 * Created by FJH on 2017/1/6.
 */

var vrService = require('../service/VisitRecordService');

vrService.page(function(err, count, rows){
    console.log(err);
    console.log(count);
    console.log(rows);
}, 0, 1);