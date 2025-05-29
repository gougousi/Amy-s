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
    img.src = `static/images/${product.image}`;

    const name = document.createElement('div');
    name.className = 'text';
    name.textContent = product.name;

    // Append elements in the correct order
    slide.appendChild(numberText);
    slide.appendChild(img);   // Make sure the image comes before the text
    slide.appendChild(name);

    document.querySelector('.slideshow-container').appendChild(slide);
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
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}

fetchProducts();
