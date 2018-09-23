import assign = require("lodash/assign");
import filter = require("lodash/filter");
import map = require("lodash/map");
import nestedProperty = require("nested-property");
import striptags = require("striptags");
import * as marked from "marked";

/**
 * Constructs outline section tokens from list items, markdown or HTML contents.
 */
namespace outlining {
    export interface ListItem {
        [x: string]: any;
        level: number;
        title: string;
    }

    export interface Section extends ListItem {
        id: string;
        children?: Section[];
    }

    export type Handler = (section: Section) => {
        [x: string]: any;
        id?: string;
        level?: number;
        title?: string;
    };

    /**
     * Constructs section tokens according to the given list items.
     * @param items The list items are an `Array<{ level, title }>`.
     * @param handler A function called each time when processing a section, 
     *  returns an object to merge current one.
     */
    export function construct(items: ListItem[], handler?: Handler): Section[] {
        let parent = { id: "0", level: 0, title: "root", children: [] };
        return setId(parseSections(items, parent, [parent])[0].children, handler);
    }

    /**
     * Constructs section tokens from the given markdown contents.
     * @param contents The markdown contents.
     * @param handler A function called each time when processing a section, 
     *  returns an object to merge current one.
     */
    export function constructMarkdown(contents: string, handler?: Handler): Section[] {
        let items: ListItem[] = map(filter(marked.lexer(contents), item => {
            return item.type == "heading";
        }), item => {
            return {
                level: item["depth"],
                title: item["text"]
            };
        });

        return construct(items, handler);
    }

    /**
     * Constructs section tokens from the given HTML contents.
     * @param contents The HTML contents.
     * @param handler A function called each time when processing a section, 
     *  returns an object to merge current one.
     */
    export function constructHtml(contents: string, handler: Handler): Section[] {
        let items: ListItem[] = map(contents.match(/<h(\d)(.*?)>([\s\S]+?)<\/h\d>/g), item => {
            return {
                level: parseInt(item.substring(2, 3)),
                title: striptags(item)
            };
        });

        return construct(items, handler);
    }

    /**
     * Gets a specific section according to the given ID.
     * @param sections The sections returned by `construct()`.
     * @param id The ID of the section in sections.
     */
    export function getSectionById(sections: Section[], id: string): Section {
        return nestedProperty.get(sections, map(id.split("."), num => {
            return parseInt(num) - 1;
        }).join(".children."));
    }

    /**
     * Renders HTML from the given the section tokens.
     * @param sections The sections returned by `construct()`.
     * @param id Sets a specific `id` attribute of the HTML element.
     * @param indent Prettifies the HTML according to the given indent string.
     */
    export function renderHtml(sections: Section[], id?: string, indent?: string): string;
    export function renderHtml(sections: Section[], id = "", indent = "", indents = "", top = true): string {
        indents = indents + indent;

        let sol = indent ? indents.slice(0, -indent.length) : "",
            eol = indent ? "\n" : "",
            html = `${sol}<ul` + (id ? ` id="${id}"` : "") + ` class="section-` + (top ? "list" : "children") + `">${eol}`;

        for (let section of sections) {
            html += `${indents}<li id="section-${section.id}" class="section-item">${eol}`;
            html += `${indents + indent}<div class="section-title level-${section.level}">${section.title}</div>${eol}`;

            if (section.children) {
                html += renderHtml.call(undefined, section.children, null, indent, indents + indent, false) + eol;
            }

            html += `${indents}</li>${eol}`;
        }

        html += `${sol}</ul>`;

        return html;
    }

    function setId(sections: Section[], handler?: Handler, prefix = ""): Section[] {
        for (let i in sections) {
            let section = sections[i],
                id = prefix + (parseInt(i) + 1);

            section.id = id;
            assign(section, handler ? handler(section) : null);

            if (section.children) {
                section.children = setId(section.children, handler, id + ".");
            }
        }

        return sections;
    }

    function parseSections(list: ListItem[], parent: Section, parentSections: Section[]): Section[] {
        let item = list.shift();

        if (!item) return parentSections;

        let section: Section = assign({ id: "" }, item);

        if (section.level > parent.level) {
            parent.children = (parent.children || []).concat(parseSections(list, section, [section]));
        } else if (section.level == parent.level) {
            parentSections.push(section);
            parent = section;
        } else {
            list.unshift(item);
            return parentSections;
        }

        if (list.length) {
            return parseSections(list, parent, parentSections);
        } else {
            return parentSections;
        }
    }
}

export = outlining;