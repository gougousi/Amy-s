function filterProducts() {
      const input = document.getElementById('productSearch');
      const filter = input.value.toLowerCase();
      const products = document.querySelectorAll('.product');

      products.forEach(product => {
        const title = product.querySelector('h3').textContent.toLowerCase();
        if (title.includes(filter)) {
          product.style.display = '';
        } else {
          product.style.display = 'none';
        }
      });
    }