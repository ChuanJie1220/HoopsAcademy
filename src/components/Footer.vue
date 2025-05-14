<template>
    <footer class="footer">
        <div class="footer-container">
            <p class="copyright">@ copyright of The Hoops Academy</p>
            <div class="social-media">
                <p>Follow our Social Media</p>
                <div class="icons">
                    <a href="https://www.facebook.com" target="_blank" class="icon">
                        <i class="bi bi-facebook me-2 fs-3"></i>
                    </a>
                    <a href="https://www.instagram.com" target="_blank" class="icon">
                        <i class="bi bi-instagram me-2 fs-3"></i>
                    </a>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
/* eslint-disable */
export default {
    name: 'Footer',
    components: {
    },
    computed: {
    },
    data: function () {
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
.footer {
    background-color: #121212;
    color: white;
    padding: 20px 0;
    text-align: center;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    bottom: 0px;
}

.footer-container {
    width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  text-align: center;
}

@media (min-width: 768px) {
    .footer-container {
        flex-direction: row;
    }
}


.copyright {
    font-weight: bold;
}

.social-media {
    display: flex;
    align-items: center;
    gap: 10px;
}

.icons {
    display: flex;
    gap: 10px;
}

.icon {
    color: white;
    font-size: 20px;
    text-decoration: none;
}

.icon:hover {
    color: #f0ad4e; 
    transition: color 0.3s ease;
}
</style>