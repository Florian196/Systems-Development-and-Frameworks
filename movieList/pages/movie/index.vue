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
        <input type="number" v-model.number="add_item_length">
        <button v-on:click="addMovie">Add movie</button>
  </div>
  </div>
</template>

<script>
import movieListQuery from '../../gql/movieListQuery.gql'
import movieListMutationDeleteMovie from '../../gql/movieListMutationDeleteMovie.gql'
import movieListMutationAddMovie from '../../gql/movieListMutationAddMovie.gql'
import ListItem from "./ListItem"

export default {
  name: "list",
  components: {
    ListItem
  },

  data: function() {
    return {
      headline: "Movie-List",
      add_item_title: "",
      add_item_length: 0,
      MovieList: this.getMovieList()
    }
  },

  methods: {
    getMovieList: async function () {
      //console.log("Start get Movie!");
      try {
        this.MovieList = await this.$apollo.query({query: movieListQuery})
          .then(({data}) => {
            //console.log(data.movieList);
            return data.movieList;
          });
      } catch (e) {
        console.error(e);
        this.error = e
      }
    },

    deleteMovie: async function(index) {
      try {
        const res = await this.$apollo.mutate({
          mutation: movieListMutationDeleteMovie,
          variables: {index: index}
        }).then(({data}) => {
          console.log(data);
          this.getMovieList();
        });
      } catch (e) {
        console.error(e);
        this.error = e
      }
    },
    addMovie: async function() {
      try {
        const res = await this.$apollo.mutate({
          mutation: movieListMutationAddMovie,
          variables: {
            title: this.add_item_title,
            length: this.add_item_length
          }
        }).then(({data}) => {
          this.MovieList = data.addMovie;
        });
      } catch (e) {
        console.error(e);
        this.error = e
      }
    },
    updateMovie: async function() {

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
