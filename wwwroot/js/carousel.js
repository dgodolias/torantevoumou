var images = document.querySelectorAll('.carousel-image');
var currentImage = 0;

// Show the first image
images[currentImage].style.display = 'block';

// Change the image every 3 seconds
setInterval(function() {
    images[currentImage].style.display = 'none';
    currentImage = (currentImage + 1) % images.length;
    images[currentImage].style.display = 'block';
}, 3000);