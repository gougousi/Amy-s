const BASE_URL = 'http://127.0.0.1:5000/';

async function fetchProducts() {
    try {
    const response = await fetch(`${BASE_URL}popular-products`);
    const data = await response.json();

    const slideshowContainer = document.querySelector('.slideshow-container');
    slideshowContainer.innerHTML = '';

    data.forEach((product, index) => {
        const slide = document.createElement('div');
        slide.className = 'mySlides fade';

        const numberText = document.createElement('div');
        numberText.className = 'numbertext';
        numberText.textContent = `${index + 1}/${data.length}`;

        const img = document.createElement('img');
        img.src = `${BASE_URL}${product.images}`;
        img.alt = product.name;

        slide.appendChild(numberText);
        slide.appendChild(img);
        slideshowContainer.appendChild(slide);
    });

    showSlides(slideIndex); // Αρχικοποιεί το slideshow
    } catch (error) {
    console.error('Error fetching products:', error);
    }
}

let slideIndex = 1;

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    const slides = document.getElementsByClassName("mySlides");
    const dots = document.getElementsByClassName("dot");

    if (slides.length === 0) return;

    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;

    for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
    }

    for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex - 1].style.display = "block";
    if (dots[slideIndex - 1]) {
    dots[slideIndex - 1].className += " active";
    }
}

fetchProducts();
