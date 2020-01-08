<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">
        movieList
      </h1>
      <h2 class="subtitle">
        You are the best user <User></User>
      </h2>
      <div class="links">
        <a
          target="_blank"
          class="button--green"
        >
          <nuxt-link to="/movie">Movie List</nuxt-link>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
import User from './user/index'
export default {
  components: {
    Logo,
    User
  },
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
