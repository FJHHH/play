/**
 * Created by FJH on 2017/1/9.
 */
var PageBean = function(currentPage, PageSize) {
    this.currentPage = currentPage;
    this.PageSize = PageSize;
};

PageBean.prototype = {
    setAllCount : function(allCount) {
        this.allCount = allCount;
        this.allPage = Math.ceil(this.allCount / this.pageSize)
    },
    getPageSize : function () {
        return this.pageSize;
    },
    getStart : function () {
        return this.pageSize * (this.currentPage - 1);
    },
    setArray : function (array) {
        this.array = Array.prototype.slice.call(array, 0);
    }
};

module.exports = PageBean;
