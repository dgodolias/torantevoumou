const carouselContainer = document.querySelector('.carousel');
const imageSources = [
  'img/ai-generated-8256457.png',
  'img/ai-generated-8256458.png', // Assuming different images for demonstration
  'img/ai-generated-8256459.png'
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