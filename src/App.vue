<template>
  <div id="app">
    <Header v-if="!pathname.includes('login')" />
    <div class="router-view">
      <router-view @openModal="openModal" />
    </div>
  </div>
</template>

<script>
import Header from "./components/Header.vue";

export default {
  name: "App",
  components: {
    Header,
  },
  data: function () {
    return {
      pathname: this.$route.path
    };
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%; /* Ensure body and html occupy full height */
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.error-message {
  text-align: left;
}
</style>
