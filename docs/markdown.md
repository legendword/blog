# Post rendering

Posts are written in Markdown and shown by the `MarkdownView` component
(`src/components/post/MarkdownView.vue`), both on the post page and in the
editor preview. The renderer lives in `src/markdown/`.

## Supported syntax

Everything in [CommonMark](https://commonmark.org/) plus tables and `~~strikethrough~~`, and:

| Feature | Syntax |
| --- | --- |
| Emoji | `:smile:` |
| Font Awesome icon | `:fa-github:` (Font Awesome 4 names keep working) |
| Subscript / superscript | `H~2~O`, `x^2^` |
| Inserted / marked text | `++inserted++`, `==marked==` |
| Footnotes | `text[^1]` and `[^1]: The note.` |
| Definition lists | `Term` followed by `:   Definition` |
| Abbreviations | `*[HTML]: Hyper Text Markup Language` |
| Task lists | `- [ ] open`, `- [x] done` |
| Table of contents | a line containing only `[toc]` (headings level 1 to 3) |
| Heading anchors | `[jump](#heading-text)` |
| Sized images | `![alt](url "title" =300x200)`, `=300x`, `=x200`, `=50%x` |
| Alert blocks | `::: warning`, `::: info`, `::: success`, `::: error`, closed by `:::` |
| Highlighted code | fenced code block with a language name |
| Inline formula | `$E = mc^2$`, or as code: `` `$E = mc^2$` `` |
| AsciiMath inline | `` `@sum_(i=1)^n i@` `` |
| Formula block | `$$ ... $$`, or a fenced block tagged `math` / `katex` |
| AsciiMath block | fenced block tagged `asciimath` |
| Mermaid diagram | fenced block tagged `mermaid` (also detected when the first line is `gantt`, `sequenceDiagram` or `graph TD`) |
| ECharts chart | fenced block tagged `echarts` containing the chart options as JSON; `width` and `height` set the size in pixels |
| flowchart.js | fenced block tagged `flowchart.js` |

Raw HTML in a post is displayed as text.

## How untrusted content is handled

Post content is written by other users, so it is treated as hostile:

1. **markdown-it runs with `html: false`.** Every plugin in `src/markdown/plugins.js`
   passes user text through `escapeHtml` before putting it into the output.
2. **The output is sanitized by DOMPurify** (`src/markdown/sanitize.js`) against an
   explicit allow-list of the tags and attributes the renderer emits. There is no
   `<script>`, `<style>`, `<iframe>`, `<svg>`, no `style` attribute and no event
   handler attribute on that list. Ids are prefixed with `user-content-` so a
   heading cannot shadow a global the page relies on.
3. **Formulas, diagrams and charts are not HTML at that point.** They are emitted as
   placeholders that carry their source as plain text. After sanitizing,
   `src/markdown/widgets.js` hands that text to the library that draws it:
   - KaTeX with `trust: false`;
   - mermaid with `securityLevel: "strict"`;
   - ECharts with options stripped of link/HTML hooks and tooltips drawn on the canvas;
   - flowchart.js with click callbacks removed and links restricted to `http(s)`/`mailto`.

When changing the renderer:

- never insert a string built from post content with `innerHTML`/`v-html` unless it
  went through `sanitize()`;
- when a new plugin needs a new tag or attribute, add it to the allow-list deliberately
  rather than loosening the sanitizer in general;
- add a case to `test/vitest/__tests__/markdown.test.js` (section "untrusted input")
  for every new piece of syntax.
