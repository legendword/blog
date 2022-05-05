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
        let inHeading = false, headingLevel = null, headingContent = null, id = 0;
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
                        id: id++,
                        level: ind,
                        content: headingContent
                    })
                }
            }
            else if (inHeading) {
                headingContent += token.content;
            }
        }
        for (let i of t) {
            if (res.length === 0 || i.level === 0) {
                // add to base res
                res.push(i);
            }
            else {
                // find lastest heading obj with headingLevel < current headingLevel
                let cur = res[res.length - 1];
                while (cur.children && cur.children[cur.children.length - 1].level < i.level) {
                    cur = cur.children[cur.children.length - 1];
                }
                if (!cur.children) {
                    cur.children = [i];
                }
                else {
                    cur.children.push(i);
                }
            }
        }
        return res;
    }

    static goToNthHeading(n, options = TableOfContents.defaultOptions) {
        let elems = document.querySelectorAll(options.headingLevels.map(v => `.post-content ${v}`).join(", "));
        if (elems.length > n) {
            elems[n].scrollIntoView({
                behavior: "smooth"
            });
        }
    }
}

export default TableOfContents;