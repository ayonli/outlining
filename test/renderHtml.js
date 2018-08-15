var assert = require("assert");
var renderHtml = require("..").renderHtml;

exports.html = [
    '<ul id="section-list" class="section-list">',
    '  <li id="section-1" class="section-item">',
    '    <div class="section-title level-1">第一章 Chapter 1</div>',
    '    <ul class="section-children">',
    '      <li id="section-1.1" class="section-item">',
    '        <div class="section-title level-2">第一节 Section 1</div>',
    '      </li>',
    '      <li id="section-1.2" class="section-item">',
    '        <div class="section-title level-2">第二节 Section 2</div>',
    '        <ul class="section-children">',
    '          <li id="section-1.2.1" class="section-item">',
    '            <div class="section-title level-3">1.2.1 Child Section 1</div>',
    '            <ul class="section-children">',
    '              <li id="section-1.2.1.1" class="section-item">',
    '                <div class="section-title level-4">1.2.1.1 Grandchild Section 1</div>',
    '              </li>',
    '            </ul>',
    '          </li>',
    '        </ul>',
    '      </li>',
    '    </ul>',
    '  </li>',
    '  <li id="section-2" class="section-item">',
    '    <div class="section-title level-1">第二章 Chapter 2</div>',
    '    <ul class="section-children">',
    '      <li id="section-2.1" class="section-item">',
    '        <div class="section-title level-2">第一节 Section 1 of Chapter 2</div>',
    '      </li>',
    '    </ul>',
    '  </li>',
    '  <li id="section-3" class="section-item">',
    '    <div class="section-title level-1">第三章 Chapter 3</div>',
    '  </li>',
    '</ul>'
].join("\n");

exports.sections = require("./construct").sections;

assert.strictEqual(renderHtml(exports.sections, "section-list", "  "), exports.html);

console.log("renderHtml", "OK");