<template>
    <div class="about-us">
        <div class="content">
            <h2>About Us</h2>
            <article>
                <p>
                    Welcome to Hoops Academy — your ultimate destination for premium sportswear and basketball lifestyle
                    essentials. At Hoops Academy, we live and breathe the game, and our mission is to empower athletes
                    and enthusiasts with high-quality gear that fuels their passion.
                </p>
                <p>
                    Whether you're hitting the court, training hard, or simply repping the culture off the court, our
                    collection is designed to keep you comfortable, stylish, and game-ready. From performance-driven
                    apparel to bold streetwear designs, Hoops Academy blends innovation with attitude.
                </p>
                <p>
                    But we're more than just a brand — we're a movement. Hoops Academy is about community, confidence,
                    and commitment to the game. We provide a space for ballers of all levels to connect, grow, and stay
                    inspired through exclusive drops, content, and events.
                </p>
                <p>
                    Join the Hoops Academy family and level up your game — on and off the court.
                </p>

            </article>
        </div>
        <div class="image-container">
            <img src="../assets/ComLogo.png" alt="HoopsAcademy Background Image" />
        </div>
    </div>
</template>

<script>
export default {
    name: "aboutUs",
};
</script>

<style scoped>

.about-us {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.content {
    flex: 1;
    padding-right: 40px;
    text-align: left;
}

h2 {
    font-size: 42px;
    color: #333;
    margin-bottom: 20px;
}

article {
    font-size: 20px;
    color: #666;
    line-height: 1.6;
}

.image-container {
    flex: 1;
}

img {
    width: 100%;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}
</style>