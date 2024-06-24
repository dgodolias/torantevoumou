const carouselContainer = document.querySelector('.carousel');
const imageSources = [
  '/img/medic.jpg',
  '/img/mypic1.jpg', // Assuming different images for demonstration
  '/img/mypic2.jpg'
];

// Dynamically create and append images to the carousel
imageSources.forEach(src => {
  const img = document.createElement('img');
  img.src = src;
  img.classList.add('carousel-image');
  carouselContainer.appendChild(img);
});

// Assuming the rest of your carousel logic remains the same
let currentIndex = 0;
const images = document.querySelectorAll('.carousel img');
const totalDuration = images.length * 5; // in seconds

images.forEach((img, index) => {
  const delay = (totalDuration / images.length) * index; // delay for each image
  img.style.animation = `carousel-animation ${totalDuration}s ${delay}s linear infinite`;
});