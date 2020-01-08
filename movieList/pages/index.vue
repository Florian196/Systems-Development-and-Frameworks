<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">
        movieList
      </h1>
      <h2 class="subtitle">
        My super-duper SDF project
      </h2>
      <form @submit.prevent="onSubmit" v-if="!isAuthenticated">
        Username: <input type="text" v-model="credentials.username" required />
        <br>
        <br>
        Password: <input type="password" v-model="credentials.password" required/>
        <br>
        <br>
        <button type="submit">Login</button>
      </form>
      <div v-else>
        <div class="links">
          <a
            target="_blank"
            class="button--green"
          >
            <nuxt-link to="/movie">Movie List</nuxt-link>
          </a>
        </div>
        <button type="button" @click="onLogout">Logout</button>
      </div>
      <div style="color: red;" v-if="error">{{error}}</div>
    </div>
  </div>
</template>

<script>
import authenticateUserGql from '../gql/authenticateUser.gql'
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  data: function() {
    return {
      isAuthenticated:false,
      error: null,
      credentials: {
          username: '',
          password: ''
      }
    }
  },
  mounted(){
    this.isAuthenticated = !!this.$apolloHelpers.getToken()
  },
  methods: {
    async onSubmit () {
        const credentials = this.credentials
        try {
            const res = await this.$apollo.mutate({
                mutation: authenticateUserGql,
                variables: credentials
            })
            await this.$apolloHelpers.onLogin(res.data.loginUser.token, undefined, { expires: 7 })
            console.log(res)
            this.isAuthenticated = true
        } catch (e) {
            console.error(e)
            this.error = e
        }
    },
    async onLogout(){
        await this.$apolloHelpers.onLogout()
        this.isAuthenticated = false
    }
}
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
