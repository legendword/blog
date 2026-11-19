<template>
    <div>
        <div ref="container" class="markdown-body" @click="onClick" />
        <image-viewer v-model="viewerOpen" v-model:index="viewerIndex" :images="viewerImages" />
    </div>
</template>

<script>
import { renderMarkdown } from "@/markdown";
import { ID_PREFIX } from "@/markdown/sanitize";
import { hydrateWidgets } from "@/markdown/widgets";
import ImageViewer from "./ImageViewer.vue";
import "@/css/markdown-body.css";

/**
 * Renders untrusted Markdown (post content, editor preview).
 * See src/markdown/index.js for the rendering pipeline and what is supported.
 */
export default {
    name: "MarkdownView",
    components: { ImageViewer },
    props: {
        content: {
            type: String,
            default: ""
        }
    },
    emits: ["rendered"],
    data() {
        return {
            viewerOpen: false,
            viewerIndex: 0,
            viewerImages: []
        };
    },
    watch: {
        content() {
            this.render();
        }
    },
    created() {
        // not reactive on purpose
        this.generation = 0;
        this.disposeWidgets = null;
    },
    mounted() {
        this.render();
    },
    beforeUnmount() {
        this.generation++;
        this.cleanup();
    },
    methods: {
        cleanup() {
            if (this.disposeWidgets) {
                this.disposeWidgets();
                this.disposeWidgets = null;
            }
        },
        async render() {
            const generation = ++this.generation;
            const isStale = () => generation !== this.generation;
            this.cleanup();

            const container = this.$refs.container;
            container.replaceChildren(renderMarkdown(this.content));

            const dispose = await hydrateWidgets(container, isStale);
            if (isStale()) {
                dispose();
                return;
            }
            this.disposeWidgets = dispose;
            this.$emit("rendered");
        },
        scrollToAnchor(hash) {
            let id = hash;
            try {
                id = decodeURIComponent(hash);
            }
            catch {
                // keep the raw value
            }
            const container = this.$refs.container;
            const target = Array.from(container.querySelectorAll("[id]"))
                .find(el => el.id === ID_PREFIX + id || el.id === id);
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        },
        onClick(ev) {
            const target = ev.target;
            if (!(target instanceof Element)) return;

            const link = target.closest("a");
            if (link) {
                const href = link.getAttribute("href") || "";
                if (href.startsWith("#")) {
                    // in-page anchors (table of contents, footnotes) never leave the post
                    ev.preventDefault();
                    this.scrollToAnchor(href.slice(1));
                }
                return;
            }

            if (target.tagName === "IMG" && target.closest(".md-image")) {
                const images = Array.from(this.$refs.container.querySelectorAll(".md-image img"));
                this.viewerImages = images.map(img => ({ src: img.currentSrc || img.src, alt: img.alt }));
                this.viewerIndex = Math.max(images.indexOf(target), 0);
                this.viewerOpen = true;
            }
        }
    }
};
</script>

<style lang="scss">
.markdown-body {
    .md-image {
        display: block;
        text-align: left;

        img {
            cursor: zoom-in;
        }
    }

    .md-align-left {
        text-align: left;
    }
    .md-align-center {
        text-align: center;
    }
    .md-align-right {
        text-align: right;
    }

    .contains-task-list {
        padding-left: 2em;
    }

    .md-math--block {
        display: block;
        margin: 1em 0;
        overflow-x: auto;
        overflow-y: hidden;
        text-align: center;
    }

    .md-mermaid {
        margin-bottom: 16px;
        overflow-x: auto;
        text-align: center;

        svg {
            max-width: 100%;
            height: auto;
        }
    }

    .md-echarts {
        max-width: 100%;
        margin-bottom: 16px;
        overflow: hidden;
    }

    .md-flowchart {
        margin-bottom: 16px;
        overflow-x: auto;
    }

    .md-widget-error {
        color: $negative;
        white-space: pre-wrap;
    }

    .md-alert {
        position: relative;
        width: 100%;
        margin-bottom: 16px;
        padding: 8px 15px 8px 37px;
        border-radius: 4px;
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
        line-height: 1.5;

        &::before {
            position: absolute;
            top: 9px;
            left: 12px;
            font-family: "Material Icons";
            font-size: 18px;
            font-style: normal;
            font-weight: normal;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
            font-feature-settings: "liga";
            -webkit-font-smoothing: antialiased;
        }

        p {
            margin-bottom: 2px;
        }

        &--info {
            border: 1px solid #91d5ff;
            background-color: #e6f7ff;

            &::before {
                content: "info";
                color: #1890ff;
            }
        }
        &--success {
            border: 1px solid #b7eb8f;
            background-color: #f6ffed;

            &::before {
                content: "check_circle";
                color: #52c41a;
            }
        }
        &--error {
            border: 1px solid #f5222d;
            background-color: #fff1f0;

            &::before {
                content: "cancel";
                color: #f5222d;
            }
        }
        &--warning {
            border: 1px solid #ffe58f;
            background-color: #fffbe6;

            &::before {
                content: "error";
                color: #faad14;
            }
        }
    }
}
</style>
