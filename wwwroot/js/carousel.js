let currentIndex = 0;
const images = document.querySelectorAll('.carousel img');

// Apply initial styles and animation delay
images.forEach((img, index) => {
    img.style.animation = `carousel-animation 8s ${index * 8}s ease-in-out`;
});

function runCarousel() {
    // Reset all images
    for(let i = 0; i < images.length; i++) {
        images[i].style.animation = '';
        void images[i].offsetWidth; // Trigger reflow to restart animation
        images[i].style.animation = `carousel-animation 8s ${i * 8}s ease-in-out`;
    }

    currentIndex++;
    if(currentIndex >= images.length) {
        currentIndex = 0;
    }
}

setInterval(runCarousel, images.length * 8000); // Change image every 8 seconds times the number of images