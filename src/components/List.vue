  <template>
  <div id="list">
	<h3>{{headline}}</h3>
	<ul>
      <ListItem v-for="(item, index) in ToDoList"
                 :item="item"
                 :index="index"
                 :key="index"
                 @deleteMyToDo="deleteMyToDo"
                 v-on:addText="addText">
      </ListItem>
      
	</ul>
  <div id="add">
        <input v-model="add_item_text" />
        <button v-on:click="addText">Add</button>
  </div>
  </div>
</template>

<script>
import ListItem from "./ListItem" 

export default {
  name: "list",
  components: {
    ListItem
  },
  data: function() {
	return {
      headline: "ToDo-List",
      ToDoList: [
        {text: "Clean room"},
        {text: "Finish task1"},
        {text: "Add task2"}
      ],
      add_item_text: ""
    }
  },
  methods: {
    deleteMyToDo: function(index) {
      this.ToDoList.splice(index, 1);
    },
    addText: function(){
      this.ToDoList.push({
        text: this.add_item_text
      });
      this.add_item_text = "";
    }
  }
}
</script>

<style>
ul {
  list-style-type: square;
}

#add {
  text-align: left;
  margin-left: 20px;
}
</style>
