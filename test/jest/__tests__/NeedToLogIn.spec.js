import { mountQuasar } from '@quasar/quasar-app-extension-testing-unit-jest';
import { QBtn } from 'quasar'; // <= cherry pick only the components you actually use
import NeedToLogIn from 'src/components/NeedToLogIn';

const $t = jest.fn();

describe('NeedToLogIn', () => {
    it('mounts without errors', () => {
        const wrapper = mountQuasar(NeedToLogIn, {
            quasar: {
                components: {
                    QBtn,
                }
            },
            mount: {
                mocks: {
                    $t,
                }
            }
        });
        expect(wrapper).toBeTruthy();
    });
});