document.addEventListener('DOMContentLoaded', function () {
  const products = document.querySelectorAll('.product');

  products.forEach(product => {
    const productId = product.querySelector('img').dataset.id;

    // Δημιουργία wrapper για κουμπί + counter δίπλα-δίπλα
    const likeWrapper = document.createElement('div');
    likeWrapper.classList.add('like-wrapper'); // για styling

    // Κουμπί like
    const likeButton = document.createElement('button');
    likeButton.textContent = '❤️ Μου αρέσει';
    likeButton.classList.add('like-btn');

    // Μετρητής likes
    const likeCount = document.createElement('span');
    likeCount.classList.add('like-count');
    likeCount.textContent = '0'; // fallback αρχική τιμή

    // ✅ Φόρτωση likes από backend
    fetch(`http://localhost:3000/likes/${productId}`)
      .then(res => res.json())
      .then(data => {
        likeCount.textContent = `${data.likes}`;
      })
      .catch(() => {
        likeCount.textContent = '0'; // fallback σε αποτυχία
      });

    // ✅ Click για like
    likeButton.addEventListener('click', () => {
      fetch(`http://localhost:3000/likes/${productId}`, {
        method: 'POST'
      })
        .then(res => res.json())
        .then(data => {
          if (data.likes !== undefined) {
            likeCount.textContent = `${data.likes}`;
          }
        })
        .catch(() => {
          alert("Σφάλμα κατά την καταχώρηση του like.");
        });
    });

    // ✅ Προσθήκη στο wrapper και στο προϊόν
    likeWrapper.appendChild(likeButton);
    likeWrapper.appendChild(likeCount);
    product.appendChild(likeWrapper);
  });
});
