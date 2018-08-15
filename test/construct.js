var assert = require("assert");
var n2c = require("n2c");
var last = require("lodash/last");
var construct = require("..").construct;

var list = [
    { level: 1, title: "Chapter 1"},
    { level: 2, title: "Section 1" },
    { level: 2, title: "Section 2" },
    { level: 3, title: "Child Section 1" },
    { level: 4, title: "Grandchild Section 1" },
    { level: 1, title: "Chapter 2" },
    { level: 2, title: "Section 1 of Chapter 2" },
    { level: 1, title: "Chapter 3" },
];

exports.expected = [
    {
        id: "1",
        level: 1,
        title: "第一章 Chapter 1",
        children: [
            {
                id: "1.1",
                level: 2,
                title: "第一节 Section 1"
            },
            {
                id: "1.2",
                level: 2,
                title: "第二节 Section 2",
                children: [
                    {
                        id: "1.2.1",
                        level: 3,
                        title: "1.2.1 Child Section 1",
                        children: [
                            {
                                id: "1.2.1.1",
                                level: 4,
                                title: "1.2.1.1 Grandchild Section 1"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "2",
        level: 1,
        title: "第二章 Chapter 2",
        children: [
            {
                id: "2.1",
                level: 2,
                title: "第一节 Section 1 of Chapter 2"
            }
        ]
    },
    {
        id: "3",
        level: 1,
        title: "第三章 Chapter 3"
    }
];

exports.sections = construct(list, (section) => {
    let units = ["", "章", "节"],
        num = last(section.id.split("."))
        orderName = units[section.level] ? ("第" + n2c(num) + units[section.level]) : section.id;

    return {
        title: `${orderName} ${section.title}`
    };
});

assert.deepStrictEqual(exports.sections, exports.expected);

console.log("construct", "OK");