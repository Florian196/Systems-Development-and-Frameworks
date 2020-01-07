import { mount, shallowMount } from '@vue/test-utils';
import ListItem from './ListItem';

const mountItem = shallowMount(ListItem, {
    propsData: {
        item: {
            text: "original"
        }
    }
});

describe("ListItem", () => {
    test('click on edit button shows input field', () =>{
        mountItem.find("#edit").trigger("click");
        expect(mountItem.contains("new_item_text")).toBe(true);
    });
    test('cancel edit changes', () =>{
        mountItem.find("new_item_text").setValue("edited");
        mountItem.find("#cancel").trigger("click");
        expect(mountItem.contains("new_item_text")).toBe(false);
        expect(mountItem.props("item").text).toBe("original");
    });   
    test('save edit changes', () =>{
        mountItem.find("#edit").trigger("click");
        mountItem.find("new_item_text").setValue("edited");
        mountItem.find("#save").trigger("click");
        expect(mountItem.contains("new_item_text")).toBe(false);
        expect(mountItem.props("item").text).toBe("edited");
    });    
});

