import { mount, shallowMount } from '@vue/test-utils';
import List from './List';
import ListItem from './ListItem';

let mountList = shallowMount(List, {
    headline: "Movie-List",
    MovieList: [
      {text: "Predator",
       length: 120},
      {text: "Frozen",
       length: 125},
      {text: "Alien vs Predator",
       length: 180}
    ],
    add_item_title: "",
    add_item_length: 0
});

describe("List", () => {
    test('is a Vue instance', () => {
        const wrapper = mount(List);
        expect(wrapper.isVueInstance()).toBeTruthy()
    });
    test('renders `ListItem`s for each movie', () => {
        expect(mountList.findAll(ListItem)).toHaveLength(3);
    });
    test('Delete item', () => {
        const length = mountList.findAll(ListItem).length;
        mountList.find(ListItem).vm.$emit('deleteMovie', 0);
        setTimeout( ()=>{
            expect(mountList.findAll(ListItem).length).toBe(length - 1);
        }, 100);
    });
    test('Add ListItem', () => {
        const length = mountList.findAll(ListItem).length;
        mountList.find(ListItem).vm.$emit('addMovie');
        setTimeout( ()=>{
            expect(mountList.findAll(ListItem).length).toBe(length + 1);
        }, 100);
    });
});

