import { mountFactory } from '@quasar/quasar-app-extension-testing-unit-jest';
import { QIntersection, QPagination, QPage } from 'quasar';
import Following from 'src/pages/Following';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';

const $t = jest.fn();
const $store = jest.fn();

const localVue = createLocalVue();
localVue.use(Vuex);

const store = new Vuex.Store({
    state: {
        isLoggedIn: false
    }
})

const factory = mountFactory(Following, {
    quasar: {
        components: { QIntersection, QPagination, QPage }
    },
    mount: {
        mocks: {
            $t,
        },
        localVue,
        store,
    }
});

describe('Following', () => {
    it('mounts without errors', () => {
        const wrapper = factory();
        expect(wrapper).toBeTruthy();
    });

    it('does not display content if not logged in', () => {
        const wrapper = factory();
        expect(wrapper.find('h4').exists()).toBe(false);
    })
});