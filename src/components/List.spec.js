import { mount, shallowMount } from '@vue/test-utils';
import List from './List';
import ListItem from './ListItem';

let mountList = shallowMount(List, {
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
        expect(mountList.findAll(ListItem)).toHaveLength(3);
    });
    test('Delete item', () => {
        const length = mountList.findAll(ListItem).length;
        mountList.find(ListItem).vm.$emit('deleteMyToDo', 0);
        setTimeout( ()=>{
            expect(mountList.findAll(ListItem).length).toBe(length - 1);
        }, 100);
    });
    test('Add ListItem', () => {
        const length = mountList.findAll(ListItem).length;
        mountList.find(ListItem).vm.$emit('addText');
        setTimeout( ()=>{
            expect(mountList.findAll(ListItem).length).toBe(length + 1);
        }, 100);
    });
});

