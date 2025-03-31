<template>
  <div id="app">
    <Header v-if="!$route.path.includes('login')" />
    <!-- <div class="router-view">
      <router-view @openModal="openModal" />
    </div> -->
    <div class="main">
      <router-view />
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Footer from './components/Footer.vue';

export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
  data: function () {
    return {
      // pathname: this.$route.path
    };
  },
  computed: {
    // pathname() {
    //   return this.$route.path;
    // }
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  /* Makes main content expand, pushing footer down */
  /* display: flex; */
  justify-content: center;
  align-items: center;
  /* padding: 20px; */
}

.footer {
  background-color: #121212;
  color: white;
  padding: 10px;
  text-align: center;
  width: 100%;
}

.error-message {
  text-align: left;
}
</style>
