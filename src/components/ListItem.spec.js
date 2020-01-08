import { mount, shallowMount } from '@vue/test-utils';
import ListItem from './ListItem';

const mountItem = shallowMount(ListItem, {
    propsData: {
        item: {
            text: "original"
        },
        index: 0
    }
});



describe("ListItem", () => {
    test('click on edit button shows input field', () =>{
        mountItem.find("#edit").trigger('click');
        setTimeout( ()=>{
            expect(mountItem.contains("input")).toBe(true);
        }, 100);
        
    });
    test('cancel edit changes', () =>{
        mountItem.find("input").setValue("edited");
        mountItem.find("#cancel").trigger("click");
        expect(mountItem.props("item").text).toBe("original");
        setTimeout( ()=>{
            expect(mountItem.contains("input")).toBe(false);
        }, 100);
    });   
    test('save edit changes', () =>{
        mountItem.find("#edit").trigger("click");
        setTimeout( ()=>{
            mountItem.find("input").setValue("edited");
            mountItem.find("#save").trigger("click");
            expect(mountItem.props("item").text).toBe("edited");
            setTimeout( ()=>{
                expect(mountItem.contains("input")).toBe(false);
            }, 100);
        }, 100);
    });    
});

