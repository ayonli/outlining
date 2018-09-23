"use strict";
var assign = require("lodash/assign");
var filter = require("lodash/filter");
var map = require("lodash/map");
var nestedProperty = require("nested-property");
var striptags = require("striptags");
var marked = require("marked");
var outlining;
(function (outlining) {
    function construct(items, handler) {
        var parent = { id: "0", level: 0, title: "root", children: [] };
        return setId(parseSections(items, parent, [parent])[0].children, handler);
    }
    outlining.construct = construct;
    function constructMarkdown(contents, handler) {
        var items = map(filter(marked.lexer(contents), function (item) {
            return item.type == "heading";
        }), function (item) {
            return {
                level: item["depth"],
                title: item["text"]
            };
        });
        return construct(items, handler);
    }
    outlining.constructMarkdown = constructMarkdown;
    function constructHtml(contents, handler) {
        var items = map(contents.match(/<h(\d)(.*?)>([\s\S]+?)<\/h\d>/g), function (item) {
            return {
                level: parseInt(item.substring(2, 3)),
                title: striptags(item)
            };
        });
        return construct(items, handler);
    }
    outlining.constructHtml = constructHtml;
    function getSectionById(sections, id) {
        return nestedProperty.get(sections, map(id.split("."), function (num) {
            return parseInt(num) - 1;
        }).join(".children."));
    }
    outlining.getSectionById = getSectionById;
    function renderHtml(sections, id, indent, indents, top) {
        if (id === void 0) { id = ""; }
        if (indent === void 0) { indent = ""; }
        if (indents === void 0) { indents = ""; }
        if (top === void 0) { top = true; }
        indents = indents + indent;
        var sol = indent ? indents.slice(0, -indent.length) : "", eol = indent ? "\n" : "", html = sol + "<ul" + (id ? " id=\"" + id + "\"" : "") + " class=\"section-" + (top ? "list" : "children") + ("\">" + eol);
        for (var _i = 0, sections_1 = sections; _i < sections_1.length; _i++) {
            var section = sections_1[_i];
            html += indents + "<li id=\"section-" + section.id + "\" class=\"section-item\">" + eol;
            html += indents + indent + "<div class=\"section-title level-" + section.level + "\">" + section.title + "</div>" + eol;
            if (section.children) {
                html += renderHtml.call(undefined, section.children, null, indent, indents + indent, false) + eol;
            }
            html += indents + "</li>" + eol;
        }
        html += sol + "</ul>";
        return html;
    }
    outlining.renderHtml = renderHtml;
    function setId(sections, handler, prefix) {
        if (prefix === void 0) { prefix = ""; }
        for (var i in sections) {
            var section = sections[i], id = prefix + (parseInt(i) + 1);
            section.id = id;
            assign(section, handler ? handler(section) : null);
            if (section.children) {
                section.children = setId(section.children, handler, id + ".");
            }
        }
        return sections;
    }
    function parseSections(list, parent, parentSections) {
        var item = list.shift();
        if (!item)
            return parentSections;
        var section = assign({ id: "" }, item);
        if (section.level > parent.level) {
            parent.children = (parent.children || []).concat(parseSections(list, section, [section]));
        }
        else if (section.level == parent.level) {
            parentSections.push(section);
            parent = section;
        }
        else {
            list.unshift(item);
            return parentSections;
        }
        if (list.length) {
            return parseSections(list, parent, parentSections);
        }
        else {
            return parentSections;
        }
    }
})(outlining || (outlining = {}));
module.exports = outlining;
//# sourceMappingURL=index.js.map