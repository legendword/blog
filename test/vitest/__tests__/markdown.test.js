import { describe, expect, it } from "vitest";
import { renderMarkdown, renderMarkdownUnsafe } from "@/markdown";
import { sanitize } from "@/markdown/sanitize";
import { slugify, createSlugger } from "@/markdown/slug";
import { sanitizeChartOption } from "@/markdown/widgets";

const FENCE = "```";

function html(source) {
    const box = document.createElement("div");
    box.appendChild(renderMarkdown(source));
    return box;
}

// what a successful injection would leave behind
function dangerousParts(box) {
    const found = [];
    for (const el of box.querySelectorAll("*")) {
        const tag = el.tagName.toLowerCase();
        if (["script", "iframe", "object", "embed", "style", "svg", "math", "form", "link", "meta", "base"].includes(tag)) {
            found.push(`<${tag}>`);
        }
        for (const attr of el.attributes) {
            if (/^on/i.test(attr.name) || attr.name === "style" || attr.name === "srcdoc") {
                found.push(`${tag}[${attr.name}]`);
            }
            if (["href", "src"].includes(attr.name) && /^\s*(javascript|vbscript|data:text)/i.test(attr.value)) {
                found.push(`${tag}[${attr.name}=${attr.value}]`);
            }
        }
    }
    return found;
}

describe("heading slugs", () => {
    // expected values were produced by the `uslug` package the previous renderer used
    const fixtures = [
        ["Hello World", "hello-world"],
        ["  Leading and trailing  ", "leading-and-trailing"],
        ["Math & Science: 101!", "math-science-101"],
        ["C++ / C# (advanced)", "c-c-advanced"],
        ["snake_case-and-kebab", "snake_case-and-kebab"],
        ["Ünïcödé Çhars — em dash", "ünïcödé-çhars-em-dash"],
        ["中文 标题", "中文-标题"],
        ["日本語のタイトル。次", "日本語のタイトル-次"],
        ["한국어 제목", "한국어-제목"],
        ["Emoji 🚀 title", "emoji-title"],
        ["1. Getting started", "1-getting-started"],
        ["What's new?", "whats-new"],
        ["ＦＵＬＬ　ＷＩＤＴＨ", "full-width"],
        ["~tilde~", "~tilde~"],
        ["foo  --  bar", "foo-bar"],
        ["", ""]
    ];
    it.each(fixtures)("slugify(%j) -> %j", (input, expected) => {
        expect(slugify(input)).toBe(expected);
    });

    it("numbers repeated headings and never returns an empty slug", () => {
        const slug = createSlugger();
        expect([slug("Intro"), slug("Intro"), slug("Intro"), slug("!!!")]).toEqual(["intro", "intro-2", "intro-3", "a"]);
    });
});

describe("markdown features", () => {
    it("renders the text extensions", () => {
        const box = html("H~2~O x^2^ ++ins++ ==mark== ~~del~~ :smile:\n\n*[HTML]: Hyper Text Markup Language\nHTML\n\nTerm\n:   Definition\n\nnote[^1]\n\n[^1]: The note.");
        expect(box.querySelector("sub").textContent).toBe("2");
        expect(box.querySelector("sup").textContent).toBe("2");
        expect(box.querySelector("ins").textContent).toBe("ins");
        expect(box.querySelector("mark").textContent).toBe("mark");
        expect(box.querySelector("s").textContent).toBe("del");
        expect(box.textContent).toContain("😄");
        expect(box.querySelector("abbr").getAttribute("title")).toBe("Hyper Text Markup Language");
        expect(box.querySelector("dl dt").textContent).toBe("Term");
        expect(box.querySelector("sup.footnote-ref a").getAttribute("href")).toBe("#fn1");
        expect(box.querySelector("section.footnotes li.footnote-item")).not.toBeNull();
    });

    it("renders task lists as disabled checkboxes", () => {
        const boxes = html("- [ ] open\n- [x] done").querySelectorAll("li.task-list-item input");
        expect(boxes).toHaveLength(2);
        expect(Array.from(boxes).map(b => [b.type, b.disabled, b.checked])).toEqual([["checkbox", true, false], ["checkbox", true, true]]);
    });

    it("renders Font Awesome icons", () => {
        expect(html("a :fa-github: b").querySelector("i.fa.fa-github")).not.toBeNull();
    });

    it("gives headings prefixed ids and builds [toc] from them", () => {
        const box = html("[toc]\n\n# One\n\n## Two\n\n## Two\n\n#### Too deep");
        expect(Array.from(box.querySelectorAll("h1, h2")).map(h => h.id)).toEqual(["user-content-one", "user-content-two", "user-content-two-2"]);
        expect(Array.from(box.querySelectorAll("ul.markdownIt-TOC a")).map(a => a.getAttribute("href"))).toEqual(["#one", "#two", "#two-2"]);
    });

    it("supports the image size syntax", () => {
        const img = html("![alt text](/a.png \"the title\" =120x80)").querySelector(".md-image img");
        expect([img.getAttribute("src"), img.getAttribute("alt"), img.getAttribute("title"), img.getAttribute("width"), img.getAttribute("height")])
            .toEqual(["/a.png", "alt text", "the title", "120", "80"]);
        expect(html("![a](/a.png =50%x)").querySelector("img").getAttribute("width")).toBe("50%");
        expect(html("![a](/a.png)").querySelector("img").hasAttribute("width")).toBe(false);
    });

    it("opens external links in a new tab and keeps anchors in place", () => {
        const box = html("[out](https://example.com/) [in](#section)");
        const [out, anchor] = box.querySelectorAll("a");
        expect([out.getAttribute("target"), out.getAttribute("rel")]).toEqual(["_blank", "noopener noreferrer"]);
        expect(anchor.hasAttribute("target")).toBe(false);
    });

    it("aligns table columns without inline styles", () => {
        const cells = html("| a | b | c |\n|:--|--:|:-:|\n| 1 | 2 | 3 |").querySelectorAll("tbody td");
        expect(Array.from(cells).map(td => td.className)).toEqual(["md-align-left", "md-align-right", "md-align-center"]);
    });

    it("renders alert containers", () => {
        const box = html("::: warning\ncareful\n:::\n\n::: success\nok\n:::");
        expect(box.querySelector(".md-alert.md-alert--warning p").textContent).toBe("careful");
        expect(box.querySelector(".md-alert.md-alert--success")).not.toBeNull();
    });

    it("highlights code", () => {
        const box = html(`${FENCE}python\ndef f():\n    return 1\n${FENCE}`);
        expect(box.querySelector("pre.hljs code .hljs-keyword").textContent).toBe("def");
    });

    it("emits formulas as inert placeholders holding the TeX source", () => {
        const box = html(`inline $a^2$ and \`$b^2$\` and \`@x/y@\`\n\n$$\nc^2\n$$\n\n${FENCE}math\nd^2\n\ne^2\n${FENCE}\n\n${FENCE}asciimath\nsqrt(x)\n${FENCE}`);
        const formulas = Array.from(box.querySelectorAll("[data-md-widget=\"math\"]"));
        const tex = formulas.map(el => el.textContent.trim());
        expect(formulas.map(el => el.getAttribute("data-md-display"))).toEqual([null, null, null, "true", "true", "true", "true"]);
        expect([tex[0], tex[1], tex[3], tex[4], tex[5]]).toEqual(["a^2", "b^2", "c^2", "d^2", "e^2"]);
        // AsciiMath is converted to TeX
        expect(tex[2]).toMatch(/^\\frac/);
        expect(tex[6]).toMatch(/^\\sqrt/);
    });

    it("emits diagrams and charts as inert placeholders", () => {
        const box = html([
            `${FENCE}mermaid\ngraph TD\nA-->B\n${FENCE}`,
            `${FENCE}\nsequenceDiagram\nA->>B: hi\n${FENCE}`,
            `${FENCE}echarts\n{"series": []}\n${FENCE}`,
            `${FENCE}flowchart.js\nst=>start: Start\n${FENCE}`
        ].join("\n\n"));
        expect(Array.from(box.querySelectorAll("pre[data-md-widget]")).map(el => el.getAttribute("data-md-widget")))
            .toEqual(["mermaid", "mermaid", "echarts", "flowchart"]);
        expect(box.querySelector("[data-md-widget=\"echarts\"]").textContent).toBe("{\"series\": []}");
    });
});

describe("untrusted input", () => {
    it("sanitizer removes active content from raw HTML (control: the checks below can fail)", () => {
        const dirty = "<p onclick=\"x()\">a<script>alert(1)</script><img src=x onerror=alert(2)><iframe src=\"javascript:alert(3)\"></iframe><a href=\"javascript:alert(4)\">b</a><svg onload=alert(5)></svg><style>*{}</style><b style=\"color:red\">c</b></p>";
        const raw = document.createElement("div");
        raw.innerHTML = dirty;
        expect(dangerousParts(raw).length).toBeGreaterThan(5);

        const clean = document.createElement("div");
        clean.appendChild(sanitize(dirty));
        expect(dangerousParts(clean)).toEqual([]);
        expect(clean.querySelector("a").hasAttribute("href")).toBe(false);
    });

    const attacks = {
        "raw HTML": "<img src=x onerror=alert(1)>\n\n<script>alert(1)</script>\n\n<iframe srcdoc=\"<script>alert(1)</script>\"></iframe>",
        "script URLs": "[a](javascript:alert(1)) [b](JaVaScRiPt:alert(1)) [c](data:text/html,<script>alert(1)</script>) ![d](javascript:alert(1))",
        "attribute breakout in images": "![a\" onerror=\"alert(1)](x \"t\\\" onerror=\\\"alert(1)\")",
        // the three payloads that executed in the previous renderer
        "flowchart.js fence (previously exploitable)": `${FENCE}flowchart.js\n<img src=x onerror="alert(1)">\n${FENCE}`,
        "echarts JSON value (previously exploitable)": `${FENCE}echarts\n{"title":"<img src=x onerror=alert(1)>"}\n${FENCE}`,
        "echarts width breakout (previously exploitable)": `${FENCE}echarts\n{"width":"1\\"><img src=x onerror=\\"alert(1)\\"><i x=\\""}\n${FENCE}`,
        "mermaid fence": `${FENCE}mermaid\ngraph TD\nA["<img src=x onerror=alert(1)>"] --> B\n${FENCE}`,
        "headings and [toc]": "[toc]\n\n# <img src=x onerror=alert(1)>\n\n## x\"onmouseover=\"alert(1)",
        "code info string": `${FENCE}js"><img src=x onerror=alert(1)>\ncode\n${FENCE}`,
        "formulas": "$\\href{javascript:alert(1)}{x}$ `$<img src=x onerror=alert(1)>$` `@<img src=x onerror=alert(1)>@`",
        "icons, containers, abbreviations, footnotes": ":fa-x\"onmouseover=\"alert(1): \n\n::: warning <img src=x onerror=alert(1)>\ntext\n:::\n\n*[HTML]: \"><img src=x onerror=alert(1)>\nHTML\n\nx[^a\"><img src=x onerror=alert(1)>]\n\n[^a\"><img src=x onerror=alert(1)>]: note",
        "tables": "| <img src=x onerror=alert(1)> |\n|:--\"onmouseover=\"x|\n| <script>alert(1)</script> |"
    };
    it.each(Object.entries(attacks))("neutralizes %s", (name, source) => {
        const box = html(source);
        expect(dangerousParts(box)).toEqual([]);
        // whatever <img> survives must be a plain image the author is allowed to embed
        for (const img of box.querySelectorAll("img")) {
            expect(Array.from(img.attributes).map(a => a.name).filter(n => !["src", "alt", "title", "width", "height", "loading", "referrerpolicy"].includes(n))).toEqual([]);
        }
    });

    it("escapes HTML in the unsanitized renderer output as well", () => {
        const out = renderMarkdownUnsafe(`${FENCE}flowchart.js\n<img src=x onerror="alert(1)">\n${FENCE}\n\n<b>bold</b>`);
        expect(out).not.toContain("<img");
        expect(out).not.toContain("<b>");
        expect(out).toContain("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
    });

    it("prefixes ids so headings cannot shadow page globals", () => {
        const ids = Array.from(html("# cookie\n\n# location\n\n# SafariViewController").querySelectorAll("h1")).map(h => h.id);
        expect(ids.every(id => id.startsWith("user-content-"))).toBe(true);
    });
});

describe("chart options", () => {
    it("drops HTML and navigation hooks and forces canvas tooltips", () => {
        const option = sanitizeChartOption({
            title: { text: "T", link: "javascript:alert(1)", sublink: "https://example.com", target: "self" },
            tooltip: { formatter: "<img src=x onerror=alert(1)>", renderMode: "html", extraCssText: "x", appendToBody: true, className: "c" },
            series: [{ type: "bar", data: [1, 2], tooltip: { formatter: "{b}" } }]
        });
        expect(option.title).toEqual({ text: "T" });
        expect(option.tooltip).toEqual({ formatter: "<img src=x onerror=alert(1)>", renderMode: "richText" });
        expect(option.series[0].tooltip).toEqual({ formatter: "{b}", renderMode: "richText" });
        expect(option.series[0].data).toEqual([1, 2]);
    });

    it("ignores prototype keys", () => {
        const option = sanitizeChartOption(JSON.parse("{\"__proto__\": {\"polluted\": true}, \"constructor\": {\"prototype\": {\"polluted\": true}}, \"a\": 1}"));
        expect(option).toEqual({ a: 1 });
        expect({}.polluted).toBeUndefined();
    });
});
