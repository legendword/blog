/**
 * Post rendering: Markdown (plus the extensions listed below) to sanitized DOM.
 *
 *   markdown source
 *     -> markdown-it with raw HTML disabled          (./plugins.js)
 *     -> DOMPurify with a strict allow-list           (./sanitize.js)
 *     -> charts / diagrams / formulas drawn by their own libraries from inert
 *        text placeholders, after sanitizing          (./widgets.js)
 *
 * Supported on top of CommonMark + tables + strikethrough:
 *   emoji shortcodes, subscript / superscript, footnotes, definition lists,
 *   abbreviations, ++inserted++ and ==marked== text, task lists,
 *   `:fa-*:` Font Awesome icons, `[toc]`, heading anchors, sized images,
 *   `::: warning|info|success|error` blocks, syntax highlighting,
 *   KaTeX / AsciiMath formulas, mermaid, ECharts and flowchart.js blocks.
 */
import MarkdownIt from "markdown-it";
import { full as emoji } from "markdown-it-emoji";
import subscript from "markdown-it-sub";
import superscript from "markdown-it-sup";
import footnote from "markdown-it-footnote";
import deflist from "markdown-it-deflist";
import abbreviation from "markdown-it-abbr";
import insert from "markdown-it-ins";
import mark from "markdown-it-mark";
import container from "markdown-it-container";
import { tex } from "@mdit/plugin-tex";

import {
    ALERT_TYPES,
    alertOptions,
    fencePlugin,
    fontAwesomePlugin,
    headingPlugin,
    imagePlugin,
    inlineCodeMathPlugin,
    linkPlugin,
    renderTex,
    tableAlignPlugin,
    taskListPlugin
} from "./plugins";
import { sanitize } from "./sanitize";

let md = null;

function getMarkdownIt() {
    if (md === null) {
        md = new MarkdownIt({
            html: false, // never let raw HTML from a post through
            linkify: false,
            typographer: false
        })
            .use(emoji)
            .use(subscript)
            .use(superscript)
            .use(footnote)
            .use(deflist)
            .use(abbreviation)
            .use(insert)
            .use(mark)
            .use(fencePlugin)
            .use(inlineCodeMathPlugin)
            .use(linkPlugin)
            .use(tableAlignPlugin)
            .use(taskListPlugin)
            .use(fontAwesomePlugin)
            .use(headingPlugin)
            .use(imagePlugin);

        md.use(tex, { delimiters: "dollars", render: renderTex(md) });

        for (const type of ALERT_TYPES) {
            md.use(container, type, alertOptions(type));
        }
    }
    return md;
}

/**
 * @param {string} source Markdown
 * @returns {string} unsanitized HTML; do not insert this into a page
 */
export function renderMarkdownUnsafe(source) {
    return getMarkdownIt().render(source || "", {});
}

/**
 * @param {string} source Markdown
 * @returns {DocumentFragment} sanitized content, safe to insert into the page
 */
export function renderMarkdown(source) {
    return sanitize(renderMarkdownUnsafe(source));
}
