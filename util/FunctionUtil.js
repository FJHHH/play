/**
 * Created by FJH on 2017/2/4.
 */
var isFunction = function (obj) {
    return obj && typeof obj === 'function';
};

module.exports = {
    isFunction: isFunction
};