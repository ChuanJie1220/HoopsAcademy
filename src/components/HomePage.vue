<template>
  <div class="homepage-container">

    <b-carousel id="carousel-1" ref="carousel" :interval="5000" controls :indicators="false" background="#ababab"
      :no-hover-pause="true">
      <b-carousel-slide v-for="(image, index) in images" :key="index" :img-src="require(`../assets/${image}`)"
        :alt="'Slide ' + (index + 1)" />
    </b-carousel>

    <Product />
  </div>
</template>

<script>
import Product from './Product.vue';

/* eslint-disable */
export default {
  name: "home",
  components: {
    Product,
  },
  computed: {

  },
  data: function () {
    return {
      images: ["sabrina.jpg", "ja.jpg", "harden9.jpg", "jb.jpg", "wade.jpg", "nbajersey.jpg"],
      currentIndex: 0,
      slide: 0,
      sliding: null,
      product: [],
    };
  },
  props: {
  },
  methods: {
    onSlideStart(slide) {
      this.sliding = true;
    },
    onSlideEnd(slide) {
      this.sliding = false;
    },

  },
  mounted() {
    this.$nextTick(() => {
      const carousel = this.$refs.carousel;
      if (carousel && typeof carousel.start === 'function') {
        carousel.start();
      }
    });
  },
  watch: {
  }
}
</script>

<style scoped>
.home-container {
  overflow-y: auto;
  max-height: 800px;
}

.slider {
  width: 100ch;
  height: auto;
  position: relative;
  /* max-height: 300px; */
  margin: 0 auto;
}

.slider img {
  width: 100vh;
  height: 300px;
}

button:hover {
  background-color: rgba(0, 0, 0, 0.8);
}
</style>