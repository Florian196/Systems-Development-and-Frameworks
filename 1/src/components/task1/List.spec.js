import { mount } from '@vue/test-utils';
import List from './List';


    test('is a Vue instance', () => {
        const wrapper = mount(List)
        expect(wrapper.isVueInstance()).toBeTruthy()
    })

