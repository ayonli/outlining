# outlining

Constructs outline section tokens from list items, markdown or HTML contents.

## Install

```sh
npm i outlining
```

## Example

```javascript
const { construct, constructMarkdown, constructHtml } = require("outlining");

var list = [
    { level: 1, title: "Chapter 1" },
    { level: 2, title: "Section 1" },
    { level: 2, title: "Section 2" },
    { level: 3, title: "Child Section 1" },
    { level: 4, title: "Grandchild Section 1" },
    { level: 1, title: "Chapter 2" },
    { level: 2, title: "Section 1 of Chapter 2" },
    { level: 1, title: "Chapter 3" },
];

var html = `
<h1>Chapter 1</h1>

<h2>Section 1</h2>

<h2>Section 2</h2>

<h3>Child Section 1</h3>

<h4>Grandchild Section 1</h4>

<h1>Chapter 2</h1>

<h2>Section 1 of Chapter 2</h2>

<h1>Chapter 3</h1>

<p>This is a paragraph.</p>'
`;

var md = `
# Chapter 1

## Section 1

## Section 2

### Child Section 1

#### Grandchild Section 1

# Chapter 2

## Section 1 of Chapter 2

# Chapter 3

This is a paragraph.
`;

console.log(construct(list));
console.log(constructHtml(html));
console.log(constructMarkdown(md));

/*
The above examples all result as bellow:

{
  id: "1",
  level: 1,
  title: "Chapter 1",
  children: [
    {
      id: "1.1",
      level: 2,
      title: "Section 1"
    },
    {
      id: "1.2",
      level: 2,
      title: "Section 2",
      children: [
          {
            id: "1.2.1",
            level: 3,
            title: "Child Section 1",
            ....
*/
```

## API

### `construct(items: ListItem[], handler?: (section: Section) => Section): Section[]`

*Constructs section tokens according to the given list items.*

- `items` The list items are an `Array<{ level, title }>`.
- `handler` A function called each time when processing a section, returns an 
    object to merge current one.

### `constructMarkdown(contents: string, handler?: (section: Section) => Section): Section[]`

*Constructs section tokens from the given markdown contents.*

- `contents` The markdown contents.
- `handler` A function called each time when processing a section, returns an 
    object to merge current one.

### `constructHtml(contents: string, handler?: (section: Section) => Section): Section[]`

*Constructs section tokens from the given HTML contents.*

- `contents` The HTML contents.
- `handler` A function called each time when processing a section, returns an 
    object to merge current one.

### `getSectionById(sections: Section[], id: string): Section`

*Gets a specific section according to the given ID.*

- `sections` The sections returned by `construct()`.
- `id` The ID of the section in sections.

### renderHtml(sections: Section[], id?: string, indent?: string): string

*Renders HTML from the given the section tokens.*

- `sections` The sections returned by `construct()`.
- `id` Sets a specific `id` attribute of the HTML element.
- `indent` Prettifies the HTML according to the given indent string.

### More Examples

Please check [./test/](./test/).