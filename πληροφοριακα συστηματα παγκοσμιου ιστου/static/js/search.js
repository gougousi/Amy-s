function removeDiacritics(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function filterProducts() {
  const input = document.getElementById('productSearch');
  const filter = removeDiacritics(input.value.toLowerCase());

  const products = document.querySelectorAll('.product, article');

  products.forEach(product => {
    const titleElement = product.querySelector('h2') || product.querySelector('h3');
    const title = titleElement ? titleElement.textContent.toLowerCase() : '';
    const normalizedTitle = removeDiacritics(title);

    product.style.display = normalizedTitle.includes(filter) ? '' : 'none';
  });
}