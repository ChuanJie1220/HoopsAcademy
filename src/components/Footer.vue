<template>
    <footer class="footer">
        <div class="footer-container">
            <p class="copyright">@ copyright of The Hoops Academy</p>
            <div class="social-media">
                <p>Follow our Social Media</p>
                <div class="icons">
                    <a href="https://www.facebook.com" target="_blank" class="icon">
                        <img src="../assets/fb.jpg" alt="Facebook" class="fb-icon" />
                    </a>
                    <a href="https://www.instagram.com" target="_blank" class="icon">
                        <img src="../assets/instagram.png" alt="Instagram" class="insta-icon" />
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

.fb-icon {
    width: 65px;
    height: 50px;
}

.insta-icon {
    width: 70px;
    height: 50px;
}
</style>