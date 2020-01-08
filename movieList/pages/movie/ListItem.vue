<template>
  <div id="list-item">
    <div v-if="edit">
      <li>
        <input id="title" v-model="new_item_title" />
        <input id="length" type="number" v-model="new_item_length" />
        <button id="save" @click="saveNewMovie">Save</button>
        <button id="cancel" @click="cancelSavingMode">Cancel</button>
      </li>
    </div>
    <div v-else>
      <li>Titel: {{item.title}}, Dauer: {{item.length}} min
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
  data() {
    return {
      edit: false,
      new_item_title: "",
      new_item_length: 0
    }
  },
  methods: {
    setSavingMode: function() {
      this.edit = true;
      this.new_item_title = this.item.title;
      this.new_item_length = this.item.length;
    },

    cancelSavingMode: function() {
      this.edit = false;
    },
    saveNewMovie: function() {
      this.item.title = this.new_item_title;
      this.item.length = this.new_item_length;
      this.edit = false;
    },
    deleteItem: function(){
      this.$emit("deleteMovie", this.index);
    }
  }
}
</script>

<style>
li {
  text-align: left;
}
</style>
