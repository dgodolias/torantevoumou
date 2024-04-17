let currentIndex = 0;
const images = document.querySelectorAll('.carousel img');

// Apply initial styles and animation delay
images.forEach((img, index) => {
    img.style.animation = `carousel-animation ${images.length * 4}s ${index * 4}s linear infinite`;
});