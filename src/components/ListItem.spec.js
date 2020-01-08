import { mount, shallowMount } from '@vue/test-utils';
import ListItem from './ListItem';

const mountItem = shallowMount(ListItem, {
    propsData: {
        item: {
            title: "Predator",
            length: 120
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
        mountItem.find("input#title").setValue("Frozen");
        mountItem.find("input#length").setValue(125);
        mountItem.find("#cancel").trigger("click");
        expect(mountItem.props("item").title).toBe("Predator");
        expect(mountItem.props("item").length).toBe(120);
        setTimeout( ()=>{
            expect(mountItem.contains("input")).toBe(false);
        }, 100);
    });   
    test('save edit changes', () =>{
        mountItem.find("#edit").trigger("click");
        setTimeout( ()=>{
            mountItem.find("input#title").setValue("Frozen");
            mountItem.find("input#length").setValue(125);
            mountItem.find("#save").trigger("click");
            expect(mountItem.props("item").title).toBe("Frozen");
            expect(mountItem.props("item").length).toBe(125);
            setTimeout( ()=>{
                expect(mountItem.contains("input")).toBe(false);
            }, 100);
        }, 100);
    });    
});

