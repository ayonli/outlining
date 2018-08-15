var assert = require("assert");
var n2c = require("n2c");
var last = require("lodash/last");
var constructHtml = require("..").constructHtml;

var html = [
    '<h1>Chapter 1</h1>',
    '',
    '<h2>Section 1</h2>',
    '',
    '<h2>Section 2</h2>',
    '',
    '<h3>Child Section 1</h3>',
    '',
    '<h4>Grandchild Section 1</h4>',
    '',
    '<h1>Chapter 2</h1>',
    '',
    '<h2>Section 1 of Chapter 2</h2>',
    '',
    '<h1>Chapter 3</h1>',
    '',
    '<p>This is a paragraph.</p>'
].join("\n");

exports.expected = require("./construct").expected;

exports.sections = constructHtml(html, (section) => {
    var units = ["", "章", "节"],
        num = last(section.id.split("."))
        orderName = units[section.level] ? ("第" + n2c(num) + units[section.level]) : section.id;

    return {
        title: `${orderName} ${section.title}`
    };
});

assert.deepStrictEqual(exports.sections, exports.expected);

console.log("constructHtml", "OK");