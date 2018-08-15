var assert = require("assert");
var n2c = require("n2c");
var last = require("lodash/last");
var constructMarkdown = require("..").constructMarkdown;

var md = [
    '# Chapter 1',
    '',
    '## Section 1',
    '',
    '## Section 2',
    '',
    '### Child Section 1',
    '',
    '#### Grandchild Section 1',
    '',
    '# Chapter 2',
    '',
    '## Section 1 of Chapter 2',
    '',
    '# Chapter 3',
    '',
    'This is a paragraph.'
].join("\n");

exports.expected = require("./construct").expected;

exports.sections = constructMarkdown(md, (section) => {
    let units = ["", "章", "节"],
        num = last(section.id.split("."))
        orderName = units[section.level] ? ("第" + n2c(num) + units[section.level]) : section.id;

    return {
        title: `${orderName} ${section.title}`
    };
});

assert.deepStrictEqual(exports.sections, exports.expected);

console.log("constructMarkdown", "OK");