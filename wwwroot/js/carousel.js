let currentIndex = 0;
const images = document.querySelectorAll('.carousel img');

// Apply initial styles and animation delay
images.forEach((img, index) => {
    img.style.animation = `carousel-animation 4s ${index * 4}s`;
});

function runCarousel() {
    // Reset all images
    for(let i = 0; i < images.length; i++) {
        images[i].style.animation = '';
        void images[i].offsetWidth; // Trigger reflow to restart animation
        images[i].style.animation = `carousel-animation 4s ${i * 4}s`;
    }

    currentIndex++;
    if(currentIndex >= images.length) {
        currentIndex = 0;
    }
}

setInterval(runCarousel, images.length * 4000); // Change image every 4 seconds times the number of images