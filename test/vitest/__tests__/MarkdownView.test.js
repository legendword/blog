import { installQuasarPlugin } from "@quasar/quasar-app-extension-testing-unit-vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import MarkdownView from "@/components/post/MarkdownView.vue";
import { createGlobals } from "../helpers";

installQuasarPlugin();

describe("MarkdownView", () => {
    it("renders sanitized markdown and re-renders when the content changes", async () => {
        const wrapper = mount(MarkdownView, {
            props: { content: "# Title\n\n<img src=x onerror=alert(1)>" },
            global: createGlobals().global
        });
        await flushPromises();
        const body = wrapper.find(".markdown-body");
        expect(body.find("h1").text()).toBe("Title");
        expect(body.find("img").exists()).toBe(false);
        expect(body.text()).toContain("<img src=x onerror=alert(1)>");
        expect(wrapper.emitted("rendered")).toHaveLength(1);

        await wrapper.setProps({ content: "## Other" });
        await flushPromises();
        expect(body.find("h1").exists()).toBe(false);
        expect(body.find("h2").text()).toBe("Other");
    });
});
