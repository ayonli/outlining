var assert = require("assert");
var getSectionById = require("..").getSectionById;

exports.expected = require("./construct").expected;
exports.sections = require("./construct").sections;

assert.deepStrictEqual(getSectionById(exports.sections, "1.2"), exports.sections[0].children[1]);

console.log("getSectionById", "OK");