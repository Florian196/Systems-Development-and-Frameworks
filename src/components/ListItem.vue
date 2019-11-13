<template>
  <div id="list-item">
    <div v-if="edit">
      <li>
      <input v-model="new_item_text" />
      <button @click="saveNewText">Save</button>
      <button @click="cancelSavingMode">Cancel</button>
      </li>
    </div>
    <div v-else>
      <li>{{item.text}}
      <button @click="setSavingMode">Edit</button>
      <button @click="$emit('delete-item')">Delete</button>
      </li>
    </div>
  </div>
</template>

<script>
export default {
  name: 'list-item',
  props: ['item'],
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
    }
  }
}
</script>

<style>
li {
  text-align: left;
}
</style>