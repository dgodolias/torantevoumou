let currentIndex = 0;
const images = document.querySelectorAll('.carousel img');

// Apply initial styles and animation delay
images.forEach((img, index) => {
    img.style.animation = `carousel-animation 4s ${index * 4}s infinite`; // Change '4' to the duration of your animation
});

function runCarousel() {
    currentIndex++;
    if(currentIndex >= images.length) {
        currentIndex = 0;
    }
}

setInterval(runCarousel, 4000); // Change image every 4 seconds