/**
 * Heading slugs.
 *
 * This is a dependency-free port of the `uslug` algorithm the previous renderer
 * (markdown-it-github-toc) used, so `[text](#heading)` links written against
 * existing posts keep resolving to the same anchors.
 */
const ALLOWED_CHARS = "-_~";
const KEEP = /[\p{L}\p{N}\p{M}]/u;
const SPACE = /\p{Z}/u;

export function slugify(string) {
    const chars = (string || "").normalize("NFKC");
    const rv = [];
    for (let i = 0; i < chars.length; i++) {
        const c = chars[i];
        const code = c.charCodeAt(0);
        // Common CJK Unified Ideographs and Hangul
        if ((0x4E00 <= code && code <= 0x9FFF) || (0xAC00 <= code && code <= 0xD7A3)) {
            rv.push(c);
            continue;
        }
        // Japanese ideographic punctuation
        if ((0x3000 <= code && code <= 0x3002) || (0xFF01 <= code && code <= 0xFF02)) {
            rv.push(" ");
        }
        if (ALLOWED_CHARS.includes(c)) {
            rv.push(c);
            continue;
        }
        if (KEEP.test(c)) {
            rv.push(c);
        }
        else if (SPACE.test(c)) {
            rv.push(" ");
        }
    }
    return rv.join("")
        .replace(/^\s+|\s+$/g, "")
        .replace(/\s+/g, " ")
        .replace(/[\s-]+/g, "-")
        .toLowerCase();
}

/**
 * Returns a function producing unique slugs within one document
 * (`title`, `title-2`, `title-3`, ...).
 */
export function createSlugger() {
    const seen = Object.create(null);
    return (string) => {
        let key = slugify(string);
        if (key === "") {
            key = "a";
        }
        seen[key] = (seen[key] || 0) + 1;
        return key + (seen[key] > 1 ? `-${seen[key]}` : "");
    };
}
