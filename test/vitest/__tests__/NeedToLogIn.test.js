import { installQuasarPlugin } from "@quasar/quasar-app-extension-testing-unit-vitest";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import NeedToLogIn from "@/components/NeedToLogIn.vue";
import { createGlobals } from "../helpers";

installQuasarPlugin();

describe("NeedToLogIn", () => {
    it("mounts without errors", () => {
        const wrapper = mount(NeedToLogIn, { global: createGlobals().global });
        expect(wrapper.text()).toContain("Sign In");
    });
});
