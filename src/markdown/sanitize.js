import createDOMPurify from "dompurify";

/**
 * Everything the renderer in ./index.js is able to emit. Anything else that
 * shows up in rendered output is a bug (or an attack) and gets dropped.
 *
 * Note what is NOT here: <script>, <style>, <iframe>, <svg>, <math>, form
 * controls other than the task-list checkbox, the `style` attribute and every
 * `on*` event handler attribute. Diagrams, charts and formulas are carried as
 * plain text placeholders and only turned into markup by their own libraries
 * afterwards (see ./widgets.js).
 */
const ALLOWED_TAGS = [
    "a", "abbr", "blockquote", "br", "code", "dd", "del", "div", "dl", "dt", "em",
    "h1", "h2", "h3", "h4", "h5", "h6", "hr", "i", "img", "input", "ins", "li",
    "mark", "ol", "p", "pre", "s", "section", "span", "strong", "sub", "sup",
    "table", "tbody", "td", "th", "thead", "tr", "ul"
];

const ALLOWED_ATTR = [
    "href", "src", "alt", "title", "class", "id", "width", "height", "start",
    "type", "checked", "disabled", "target", "rel", "aria-hidden",
    "data-md-widget", "data-md-display"
];

const CONFIG = {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    // prefixes every id with "user-content-" so user-controlled ids can never
    // shadow globals the app or its libraries look up (DOM clobbering)
    SANITIZE_NAMED_PROPS: true,
    // hand back DOM nodes: no serialise -> re-parse round trip for mXSS to hide in
    RETURN_DOM_FRAGMENT: true
};

export const ID_PREFIX = "user-content-";

let purifier = null;

function getPurifier() {
    if (purifier === null) {
        // a private instance: hooks here must not leak into other DOMPurify users (e.g. mermaid)
        purifier = createDOMPurify(window);
        purifier.addHook("afterSanitizeAttributes", (node) => {
            if (node.nodeName === "A") {
                if (node.getAttribute("target") === "_blank") {
                    node.setAttribute("rel", "noopener noreferrer");
                }
                else {
                    node.removeAttribute("target");
                }
            }
            else if (node.nodeName === "INPUT") {
                // only the read-only task list checkbox is ever legitimate
                if (node.getAttribute("type") !== "checkbox") {
                    node.remove();
                    return;
                }
                node.setAttribute("disabled", "");
            }
            else if (node.nodeName === "IMG") {
                node.setAttribute("loading", "lazy");
                node.setAttribute("referrerpolicy", "no-referrer");
            }
        });
    }
    return purifier;
}

/**
 * @param {string} html untrusted HTML
 * @returns {DocumentFragment} sanitized nodes, ready to be inserted
 */
export function sanitize(html) {
    return getPurifier().sanitize(html, CONFIG);
}
