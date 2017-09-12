
module.exports.error = function () {
    const date = new Date().toLocaleString();
    Array.prototype.unshift.call(arguments, date + ' ');
    console.error.apply(this, arguments);
}

module.exports.log = function () {
    const date = new Date().toLocaleString();
    Array.prototype.unshift.call(arguments, date + ' ');
    console.log.apply(this, arguments);
}