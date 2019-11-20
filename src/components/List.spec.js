import { mount, shallowMount } from '@vue/test-utils';
import List from './List';
import ListItem from './ListItem';

const mountList = shallowMount(List, {
    headline: "ToDo-List",
    ToDoList: [
      {text: "Clean room"},
      {text: "Finish task1"},
      {text: "Add task2"}
    ],
    add_item_text: ""
});

describe("List", () => {
    test('is a Vue instance', () => {
        const wrapper = mount(List)
        expect(wrapper.isVueInstance()).toBeTruthy()
    });
    test('renders `ListItem`s for each todo', () => {
        expect(mountList.findAll(ListItem).length).toBe(3);
    });
    test('Delete item', () => {
        const length = mountList.findAll(ListItem).length;
        mountList.find(ListItem).vm.$emit('deleteMyToDo', 0);
        expect(mountList.findAll(ListItem).length).toBe(length - 1);
    });
    test('Add ListItem', () => {
        const length = mountList.findAll(ListItem).length;
        mountList.find(ListItem).vm.$emit('addText');
        expect(mountList.findAll(ListItem).length).toBe(length + 1);
    });
});

