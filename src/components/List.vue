  <template>
  <div id="list">
	<h3>{{headline}}</h3>
	<ul>
      <ListItem v-for="(item, index) in MovieList"
                 :item="item"
                 :index="index"
                 :key="index"
                 @deleteMovie="deleteMovie"
                 v-on:addText="addMovie">
      </ListItem>
      
	</ul>
  <div id="add">
        <input v-model="add_item_title" />
        <input type="number" v-model="add_item_length">
        <button v-on:click="addMovie">Add movie</button>
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
      headline: "Movie-List",
      MovieList: [
        {title: "Predator",
          length: 120},
        {title: "Frozen",
          length: 125},
        {title: "Alien vs Predator",
          length: 180}
      ],
      add_item_title: "",
      add_item_length: 0
    }
  },
  methods: {
    deleteMovie: function(index) {
      this.MovieList.splice(index, 1);
    },
    addMovie: function(){
      this.MovieList.push({
        title: this.add_item_title,
        length: this.add_item_length
      });
      this.add_item_title = "";
      this.add_item_length = 0;
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
