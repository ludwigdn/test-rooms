'use strict';


exports.isNullOrWhitespace = function (input) {
    if (typeof input === 'undefined' || input == 'undefined' || input == undefined || input == null || input == '') return true;
    return String(input).replace(/\s/g, '').length < 1;
}

exports.boolToTinyInt = function (bool) {
    if (this.isNullOrWhitespace(bool)) return undefined;
    if ('' + bool == "false") return 0;
    if ('' + bool == "true") return 1;
    return undefined;
}

exports.isValidNumber = function (number) {
    var regexp = /^[0-9]*$/;
    return !this.isNullOrWhitespace(number) && regexp.test(number);
}

exports.isValidDate = function (date) {
    var regexp = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
    return !this.isNullOrWhitespace(date) && regexp.test(date);
}

exports.renderBasicString = function(string) {
    return string.toString().trim().toLowerCase();
}