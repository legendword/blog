import { installQuasarPlugin } from "@quasar/quasar-app-extension-testing-unit-vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import api from "@/api";
import Following from "@/pages/Following.vue";
import { createGlobals } from "../helpers";

vi.mock("@/api", () => ({
    default: {
        get: vi.fn(() => Promise.resolve({ data: { success: true, posts: [], postCount: "0" } }))
    }
}));

installQuasarPlugin();

describe("Following", () => {
    it("mounts without errors", () => {
        const wrapper = mount(Following, { global: createGlobals().global });
        expect(wrapper.exists()).toBe(true);
    });

    it("does not display content if not logged in", () => {
        const wrapper = mount(Following, { global: createGlobals().global });
        expect(wrapper.find("h4").exists()).toBe(false);
        expect(api.get).not.toHaveBeenCalledWith("/posts/following", expect.anything());
    });

    it("loads the feed once logged in", async () => {
        const wrapper = mount(Following, { global: createGlobals({ isLoggedIn: true }).global });
        await flushPromises();
        expect(wrapper.find("h4").text()).toBe("New Posts");
        expect(api.get).toHaveBeenCalledWith("/posts/following", { page: 1 });
    });
});
