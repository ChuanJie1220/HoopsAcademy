<template>
  <div class="homepage-container">
    Homepage
    <b-carousel
      id="carousel-1"
      v-model="slide"
      :interval="4000"
      controls
      indicators
      @sliding-start="onSlideStart"
      @sliding-end="onSlideEnd"
      label-prev=""
      label-next=""
    >
      <!-- Text slides with image -->
      <b-carousel-slide v-for="image in images" :key="image">
        <template #img>
          <img
            class="d-block img-fluid w-100"
            width="1024"
            height="480"
            :src="require(`../assets/${image}`)"
            alt="Slide"
          />
        </template>
      </b-carousel-slide>
    </b-carousel>
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
    };
  },
  props: {
  },
  methods: {
  },
  mounted() {
  },
  watch: {
  }
}
</script>

<style scoped>
</style>