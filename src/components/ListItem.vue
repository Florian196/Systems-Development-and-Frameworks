<template>
  <div id="list-item">
    <div v-if="edit">
      <li>
      <input v-model="new_item_text" />
      <button id="save" @click="saveNewText">Save</button>
      <button id="cancel" @click="cancelSavingMode">Cancel</button>
      </li>
    </div>
    <div v-else>
      <li>{{item.text}}
      <button id="edit" @click="setSavingMode">Edit</button>
      <button @click="deleteItem">Delete</button>
      </li>
    </div>
  </div>
</template>

<script>
export default {
  name: 'listItem',
  props: ['item', 'index'],
  data: function() {
    return {
      edit: false,
      new_item_text: ""
    }
  },
  methods: {
    setSavingMode: function() {
      this.edit = true;
      this.new_item_text = this.item.text;
    },

    cancelSavingMode: function() {
      this.edit = false;
    },
    saveNewText: function() {
      this.item.text = this.new_item_text;
      this.edit = false;
    },
    deleteItem: function(){
      this.$emit("deleteMyToDo", this.index);
    }
  }
}
</script>

<style>
li {
  text-align: left;
}
</style>