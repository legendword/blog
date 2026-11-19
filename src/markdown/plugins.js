/**
 * markdown-it plugins for the syntax extensions posts can use.
 *
 * Rules shared by all of them:
 *  - user text only ever reaches the output through `escapeHtml`
 *  - nothing here emits markup that executes or loads code; charts, diagrams
 *    and formulas are emitted as inert text placeholders (see ./widgets.js)
 */
import asciimathModule from "asciimath-to-latex";
import { highlight } from "./highlight";
import { createSlugger } from "./slug";

// CommonJS package compiled from TypeScript: depending on the bundler's interop the
// default import is either the function itself or the module object wrapping it
const asciimathToLatex = typeof asciimathModule === "function" ? asciimathModule : asciimathModule.default;

const TOC_FIRST_LEVEL = 1;
const TOC_LAST_LEVEL = 3;
const TOC_CLASS = "markdownIt-TOC";
const TOC_RE = /^\[toc\]$/i;

/* ------------------------------------------------------------------ helpers */

function widget(md, type, code) {
    return `<pre class="md-widget" data-md-widget="${type}"><code>${md.utils.escapeHtml(code)}</code></pre>\n`;
}

function math(md, tex, displayMode) {
    const source = md.utils.escapeHtml(tex);
    return displayMode
        ? `<div class="md-math md-math--block" data-md-widget="math" data-md-display="true">${source}</div>\n`
        : `<span class="md-math" data-md-widget="math">${source}</span>`;
}

function asciimath(source) {
    try {
        return asciimathToLatex(source);
    }
    catch {
        return source;
    }
}

// consecutive blank lines separate formulas inside a fenced math block
function mathBlock(md, code, convert) {
    const formulas = code.split(/(?:\n\s*){2,}/)
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => math(md, convert ? convert(line) : line, true));
    return `<div class="md-math-group">${formulas.join("")}</div>\n`;
}

const MERMAID_FIRST_LINE = /^graph (?:TB|BT|RL|LR|TD);?$/;

/* ------------------------------------------------------------- fenced blocks */

/**
 * ```flowchart.js / ```echarts / ```mermaid / ```math / ```katex / ```asciimath
 * and syntax highlighting for everything else.
 */
export function fencePlugin(md) {
    md.renderer.rules.fence = (tokens, idx) => {
        const token = tokens[idx];
        const info = md.utils.unescapeAll(token.info || "").trim();
        const lang = info.split(/\s+/)[0];
        const code = token.content.trim();

        if (lang === "flowchart.js") {
            return widget(md, "flowchart", code);
        }
        if (lang === "echarts") {
            return widget(md, "echarts", code);
        }
        if (lang === "mermaid") {
            return widget(md, "mermaid", code);
        }
        // diagrams are also recognised by their first line, whatever the language tag
        const firstLine = code.split(/\n/)[0].trim();
        if (firstLine === "gantt" || firstLine === "sequenceDiagram" || MERMAID_FIRST_LINE.test(firstLine)) {
            return widget(md, "mermaid", code);
        }
        if (lang === "math" || lang === "katex") {
            return mathBlock(md, code);
        }
        if (/^ascii-?math/i.test(lang)) {
            return mathBlock(md, code, asciimath);
        }
        return `<pre class="hljs"><code>${highlight(token.content, lang)}</code></pre>\n`;
    };
}

/* --------------------------------------------------------------------- math */

/**
 * `$tex$` and `@asciimath@` written as inline code.
 * (`$tex$` / `$$tex$$` outside of code is handled by @mdit/plugin-tex.)
 */
export function inlineCodeMathPlugin(md) {
    const fallback = md.renderer.rules.code_inline;
    md.renderer.rules.code_inline = (tokens, idx, options, env, slf) => {
        let code = tokens[idx].content;
        if (code.length >= 2 && code.startsWith("@") && code.endsWith("@")) {
            code = "$" + asciimath(code.slice(1, -1)) + "$";
        }
        if (code.length >= 2 && code.startsWith("$") && code.endsWith("$")) {
            return math(md, code.slice(1, -1), false);
        }
        return fallback(tokens, idx, options, env, slf);
    };
}

export function renderTex(md) {
    return (content, displayMode) => math(md, content, displayMode);
}

/* -------------------------------------------------------------------- links */

/**
 * External links open in a new tab; in-page anchors (`#heading`) stay in place.
 */
export function linkPlugin(md) {
    const fallback = md.renderer.rules.link_open
        || ((tokens, idx, options, env, slf) => slf.renderToken(tokens, idx, options));
    md.renderer.rules.link_open = (tokens, idx, options, env, slf) => {
        const token = tokens[idx];
        const href = token.attrGet("href") || "";
        if (!href.startsWith("#")) {
            token.attrSet("target", "_blank");
            token.attrSet("rel", "noopener noreferrer");
        }
        return fallback(tokens, idx, options, env, slf);
    };
}

/* ------------------------------------------------------------------- tables */

/**
 * Column alignment as a class instead of an inline style, so the sanitizer
 * can refuse the `style` attribute altogether.
 */
export function tableAlignPlugin(md) {
    md.core.ruler.push("table_align_class", (state) => {
        for (const token of state.tokens) {
            if (token.type !== "th_open" && token.type !== "td_open") continue;
            const style = token.attrGet("style");
            if (!style) continue;
            const m = /text-align:\s*(left|right|center)/.exec(style);
            token.attrs = token.attrs.filter(attr => attr[0] !== "style");
            if (m) {
                token.attrJoin("class", `md-align-${m[1]}`);
            }
        }
    });
}

/* ---------------------------------------------------------------- task list */

/**
 * `- [ ] todo` / `- [x] done`
 */
export function taskListPlugin(md) {
    md.core.ruler.after("inline", "task_list", (state) => {
        const tokens = state.tokens;
        for (let i = 2; i < tokens.length; i++) {
            const token = tokens[i];
            if (token.type !== "inline"
                || tokens[i - 1].type !== "paragraph_open"
                || tokens[i - 2].type !== "list_item_open") {
                continue;
            }
            const first = token.children && token.children[0];
            if (!first || first.type !== "text") continue;
            const m = /^\[([ xX])\][ \u00A0]/.exec(first.content);
            if (!m) continue;

            first.content = first.content.slice(m[0].length);
            const checkbox = new state.Token("html_inline", "", 0);
            checkbox.content = `<input class="task-list-item-checkbox" type="checkbox" disabled${m[1] === " " ? "" : " checked"}> `;
            token.children.unshift(checkbox);
            tokens[i - 2].attrJoin("class", "task-list-item");

            // mark the list that owns this item
            const level = tokens[i - 2].level - 1;
            for (let j = i - 3; j >= 0; j--) {
                if (tokens[j].level === level
                    && (tokens[j].type === "bullet_list_open" || tokens[j].type === "ordered_list_open")) {
                    if (!/\bcontains-task-list\b/.test(tokens[j].attrGet("class") || "")) {
                        tokens[j].attrJoin("class", "contains-task-list");
                    }
                    break;
                }
            }
        }
    });
}

/* -------------------------------------------------------------- font awesome */

/**
 * `:fa-rocket:` -> Font Awesome icon
 */
export function fontAwesomePlugin(md) {
    const ICON_RE = /^:fa-([a-z0-9]+(?:-[a-z0-9]+)*):/;
    md.inline.ruler.before("emphasis", "fa_icon", (state, silent) => {
        if (state.src.charCodeAt(state.pos) !== 0x3A /* : */) return false;
        const m = ICON_RE.exec(state.src.slice(state.pos, state.pos + 64));
        if (!m) return false;
        if (!silent) {
            const token = state.push("fa_icon", "i", 0);
            token.meta = { name: m[1] };
        }
        state.pos += m[0].length;
        return true;
    });
    md.renderer.rules.fa_icon = (tokens, idx) =>
        `<i class="fa fa-${md.utils.escapeHtml(tokens[idx].meta.name)}" aria-hidden="true"></i>`;
}

/* --------------------------------------------------- heading ids and [toc] */

function inlineText(token) {
    return (token.children || []).reduce((acc, t) => acc + (t.content || ""), "");
}

function renderTocTree(md, nodes) {
    return nodes.map((item) => {
        let node = "<li>";
        if (item.heading) {
            node += `<a href="#${md.utils.escapeHtml(encodeURIComponent(item.heading.anchor))}">${md.utils.escapeHtml(item.heading.text)}</a>`;
        }
        if (item.nodes.length) {
            node += `<ul>${renderTocTree(md, item.nodes)}</ul>`;
        }
        return node + "</li>";
    }).join("");
}

function renderToc(md, headings) {
    const tree = { nodes: [] };
    for (const heading of headings) {
        if (heading.level < TOC_FIRST_LEVEL || heading.level > TOC_LAST_LEVEL) continue;
        let lastItem = tree;
        for (let i = 1; i < heading.level - TOC_FIRST_LEVEL + 1; i++) {
            if (lastItem.nodes.length === 0) {
                lastItem.nodes.push({ heading: null, nodes: [] });
            }
            lastItem = lastItem.nodes[lastItem.nodes.length - 1];
        }
        lastItem.nodes.push({ heading, nodes: [] });
    }
    return `<ul class="${TOC_CLASS}">${renderTocTree(md, tree.nodes)}</ul>\n`;
}

/**
 * Gives every heading an id derived from its text and replaces a `[toc]`
 * line with a linked table of contents.
 */
export function headingPlugin(md) {
    md.core.ruler.push("heading_ids_and_toc", (state) => {
        const tokens = state.tokens;
        const slug = createSlugger();
        const headings = [];

        for (let i = 0; i < tokens.length - 1; i++) {
            if (tokens[i].type !== "heading_open" || tokens[i + 1].type !== "inline") continue;
            const text = inlineText(tokens[i + 1]);
            const anchor = slug(text);
            tokens[i].attrSet("id", anchor);
            headings.push({ level: Number(tokens[i].tag.slice(1)), anchor, text });
        }
        state.env.headings = headings;

        for (let i = tokens.length - 1; i >= 0; i--) {
            const token = tokens[i];
            if (token.type !== "inline" || !/\[toc\]/i.test(token.content)) continue;

            const isWholeParagraph = TOC_RE.test(token.content.trim())
                && i > 0 && tokens[i - 1].type === "paragraph_open"
                && i + 1 < tokens.length && tokens[i + 1].type === "paragraph_close";
            if (isWholeParagraph) {
                const toc = new state.Token("toc_body", "", 0);
                toc.block = true;
                tokens.splice(i - 1, 3, toc);
                i--;
                continue;
            }
            // `[toc]` on a line of its own inside a larger paragraph
            const children = token.children || [];
            for (let j = 0; j < children.length; j++) {
                const child = children[j];
                if (child.type !== "text" || !TOC_RE.test(child.content.trim())) continue;
                const startsLine = j === 0 || children[j - 1].type === "softbreak" || children[j - 1].type === "hardbreak";
                const endsLine = j === children.length - 1 || children[j + 1].type === "softbreak" || children[j + 1].type === "hardbreak";
                if (startsLine && endsLine) {
                    children[j] = new state.Token("toc_body", "", 0);
                }
            }
        }
    });

    md.renderer.rules.toc_body = (tokens, idx, options, env) => renderToc(md, env.headings || []);
}

/* -------------------------------------------------------------------- images */

function parseNextNumber(str, pos, max) {
    const start = pos;
    let code = str.charCodeAt(pos);
    while ((pos < max && code >= 0x30 /* 0 */ && code <= 0x39 /* 9 */) || code === 0x25 /* % */) {
        code = str.charCodeAt(++pos);
    }
    return { pos, value: str.slice(start, pos) };
}

// size must follow `=` without any white space: =300x200, =300x, =x200, =50%x
function parseImageSize(str, pos, max) {
    const result = { ok: false, pos: 0, width: "", height: "" };
    if (pos >= max || str.charCodeAt(pos) !== 0x3D /* = */) return result;
    pos++;

    let code = str.charCodeAt(pos);
    if (code !== 0x78 /* x */ && (code < 0x30 || code > 0x39) /* [0-9] */) return result;

    const width = parseNextNumber(str, pos, max);
    pos = width.pos;
    code = str.charCodeAt(pos);
    if (code !== 0x78 /* x */) return result;
    pos++;

    const height = parseNextNumber(str, pos, max);
    return { ok: true, pos: height.pos, width: width.value, height: height.value };
}

/**
 * The stock image rule plus an optional size: `![alt](src "title" =WIDTHxHEIGHT)`.
 * Every image is rendered on a line of its own and opens in the viewer on click.
 */
export function imagePlugin(md) {
    const { isSpace, normalizeReference } = md.utils;

    md.inline.ruler.at("image", (state, silent) => {
        let code, label, pos, res, title, start;
        let href = "";
        let width = "";
        let height = "";
        const oldPos = state.pos;
        const max = state.posMax;

        if (state.src.charCodeAt(state.pos) !== 0x21 /* ! */) return false;
        if (state.src.charCodeAt(state.pos + 1) !== 0x5B /* [ */) return false;

        const labelStart = state.pos + 2;
        const labelEnd = state.md.helpers.parseLinkLabel(state, state.pos + 1, false);
        // parser failed to find ']', so it's not a valid link
        if (labelEnd < 0) return false;

        pos = labelEnd + 1;
        if (pos < max && state.src.charCodeAt(pos) === 0x28 /* ( */) {
            // inline link: ![alt](  <href>  "title"  =WxH  )
            pos++;
            for (; pos < max; pos++) {
                code = state.src.charCodeAt(pos);
                if (!isSpace(code) && code !== 0x0A) break;
            }
            if (pos >= max) return false;

            res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
            if (res.ok) {
                href = state.md.normalizeLink(res.str);
                if (state.md.validateLink(href)) pos = res.pos;
                else href = "";
            }

            start = pos;
            for (; pos < max; pos++) {
                code = state.src.charCodeAt(pos);
                if (!isSpace(code) && code !== 0x0A) break;
            }

            res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
            if (pos < max && start !== pos && res.ok) {
                title = res.str;
                pos = res.pos;
                for (; pos < max; pos++) {
                    code = state.src.charCodeAt(pos);
                    if (!isSpace(code) && code !== 0x0A) break;
                }
            }
            else {
                title = "";
            }

            // there must be at least one space between the previous field and the size
            if (pos - 1 >= 0 && state.src.charCodeAt(pos - 1) === 0x20) {
                res = parseImageSize(state.src, pos, state.posMax);
                if (res.ok) {
                    width = res.width;
                    height = res.height;
                    pos = res.pos;
                    for (; pos < max; pos++) {
                        code = state.src.charCodeAt(pos);
                        if (code !== 0x20 && code !== 0x0A) break;
                    }
                }
            }

            if (pos >= max || state.src.charCodeAt(pos) !== 0x29 /* ) */) {
                state.pos = oldPos;
                return false;
            }
            pos++;
        }
        else {
            // link reference
            if (typeof state.env.references === "undefined") return false;

            if (pos < max && state.src.charCodeAt(pos) === 0x5B /* [ */) {
                start = pos + 1;
                pos = state.md.helpers.parseLinkLabel(state, pos);
                if (pos >= 0) label = state.src.slice(start, pos++);
                else pos = labelEnd + 1;
            }
            else {
                pos = labelEnd + 1;
            }
            // covers label === '' and label === undefined
            // (collapsed reference link and shortcut reference link respectively)
            if (!label) label = state.src.slice(labelStart, labelEnd);

            const ref = state.env.references[normalizeReference(label)];
            if (!ref) {
                state.pos = oldPos;
                return false;
            }
            href = ref.href;
            title = ref.title;
        }

        if (!silent) {
            const content = state.src.slice(labelStart, labelEnd);
            const children = [];
            state.md.inline.parse(content, state.md, state.env, children);

            state.push("image_container_open", "span", 1).attrSet("class", "md-image");

            const token = state.push("image", "img", 0);
            token.attrs = [["src", href], ["alt", ""]];
            token.children = children;
            token.content = content;
            if (title) token.attrs.push(["title", title]);
            if (width !== "") token.attrs.push(["width", width]);
            if (height !== "") token.attrs.push(["height", height]);

            state.push("image_container_close", "span", -1);
        }

        state.pos = pos;
        state.posMax = max;
        return true;
    });
}

/* ---------------------------------------------------------------- containers */

/**
 * `::: warning`, `::: info`, `::: success`, `::: error`
 */
export const ALERT_TYPES = ["warning", "info", "success", "error"];

export function alertOptions(type) {
    return {
        validate: params => params.trim() === type,
        render: (tokens, idx) => tokens[idx].nesting === 1
            ? `<div class="md-alert md-alert--${type}">\n`
            : "</div>\n"
    };
}
