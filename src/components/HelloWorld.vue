<template>
  <div>
    <button @click="test()">
      Test
    </button>
    <p>{{ firstTest }}</p>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  components: {
  },
  computed: {
  },
  data: function() {
    return {
      firstTest: ""
    };
  },
  props: {
  },
  methods: {
    async test() {
      const response = await this.$axios.get('test');
      this.firstTest = response.data.s;
      console.log('test clicked')
    }
  },
  mounted() {
  },
  watch: {
  }
}
</script>

<style scoped>
</style>