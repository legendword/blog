import MarkdownIt from "markdown-it";

class TableOfContents {
    content;
    mdi;
    parsed;
    options;
    static defaultOptions = {
        headingLevels: ["h1", "h2", "h3"]
    }

    constructor(markdownContent, options = TableOfContents.defaultOptions) {
        this.content = markdownContent;
        this.options = options;
        this.mdi = new MarkdownIt();
        this.parsed = this.mdi.parse(this.content);
    }

    getHeadings() {
        let t = [], res = [];
        let inHeading = false, headingLevel = null, headingContent = null;
        for (let token of this.parsed) {
            if (token.type === "heading_open") {
                if (inHeading) console.error("Duplicate heading_open");
                inHeading = true;
                headingLevel = token.tag;
                headingContent = "";
            }
            else if (token.type === "heading_close") {
                if (!inHeading) console.error("Duplicate heading_close");
                inHeading = false;
                let ind = this.options.headingLevels.indexOf(headingLevel);
                if (ind !== -1) {
                    t.push({
                        level: ind,
                        content: headingContent
                    })
                }
            }
            else if (inHeading) {
                headingContent += token.content;
            }
        }
        let prevHeadingLevel = null;
        for (let i of t) {
            if (prevHeadingLevel === null || i.headingLevel === 0) {
                // add to base res
                res.push({
                    ...i,
                    children: []
                });
            }
            else {
                // find lastest heading obj with headingLevel < current headingLevel
                let cur = res[res.length - 1];
                while (cur.children.length > 0 && cur.children[0].headingLevel < i.headingLevel) {
                    cur = cur.children[cur.children.length - 1];
                }
                cur.children.push({
                    ...i,
                    children: []
                });
            }
        }
        return res;
    }
}

export default TableOfContents;