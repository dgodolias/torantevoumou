let currentIndex = 0;
const images = document.querySelectorAll('.carousel img');
const totalDuration = images.length * 5; // in seconds

// Apply initial styles and animation delay
images.forEach((img, index) => {
    const delay = (totalDuration / images.length) * index; // delay for each image
    img.style.animation = `carousel-animation ${totalDuration}s ${delay}s linear infinite`;
});