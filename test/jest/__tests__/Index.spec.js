import { mountFactory } from '@quasar/quasar-app-extension-testing-unit-jest';
import { QCard, QCardSection, QAvatar, QIcon, QPage, QChip, QSkeleton, QIntersection, QBanner, QBtn } from 'quasar';
import Index from 'src/pages/Index';

const $t = jest.fn();

const factory = mountFactory(Index, {
    quasar: {
        components: {
            QCard,
            QCardSection,
            QAvatar,
            QIcon,
            QPage,
            QChip,
            QSkeleton,
            QIntersection,
            QBanner,
            QBtn
        }
    },
    mount: {
        mocks: {
            $t,
        }
    }
});

describe('Index', () => {
    it('mounts without errors', () => {
        const wrapper = factory();

        expect(wrapper).toBeTruthy();
    });
});