import { installQuasarPlugin } from "@quasar/quasar-app-extension-testing-unit-vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import api from "@/api";
import Index from "@/pages/Index.vue";
import { createGlobals } from "../helpers";

vi.mock("@/api", () => ({
    default: {
        get: vi.fn(() => Promise.resolve({ data: { success: true, posts: [], postCount: "0" } }))
    }
}));

installQuasarPlugin();

describe("Index", () => {
    it("mounts without errors and requests the first page of posts", async () => {
        const wrapper = mount(Index, { global: createGlobals().global });
        await flushPromises();
        expect(wrapper.find("h4").text()).toBe("All Posts");
        expect(api.get).toHaveBeenCalledWith("/posts", { count: 6, page: 1 });
    });
});
