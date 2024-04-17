var images = document.querySelectorAll('.carousel-image');
var currentImage = 0;

// Show the first image
images[currentImage].classList.add('show');

// Change the image every 4 seconds
setInterval(function() {
    images[currentImage].classList.remove('show', 'carousel-image');
    void images[currentImage].offsetWidth;
    images[currentImage].classList.add('carousel-image');

    currentImage = (currentImage + 1) % images.length;

    images[currentImage].classList.remove('carousel-image');
    void images[currentImage].offsetWidth;
    images[currentImage].classList.add('show', 'carousel-image');
}, 4000); /* Increase the interval to 4 seconds */