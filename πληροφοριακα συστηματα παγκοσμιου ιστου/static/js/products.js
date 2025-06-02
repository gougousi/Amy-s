/*const searchBtn = document.getElementById('searchBtn');
const searchField = document.getElementById('searchInput');
const tableBody = document.getElementById('resultsTable');

function clearResults() {
  tableBody.innerHTML = '';
}

function createProductRow(product) {
  const row = document.createElement('tr');

  const nameTd = document.createElement('td');
  nameTd.textContent = product.name;

  const imageTd = document.createElement('td');
  const img = document.createElement('img');
  let imgPath = product.image;
  if (imgPath && !imgPath.includes(".")) {
    imgPath += ".jpg"; // Αν δεν έχει επέκταση, προσθέτει .jpg
  }
  img.src = imgPath ? `/static/images/${imgPath}` : "/static/images/placeholder.jpg";
  img.alt = product.name;
  img.width = 100;

  const descTd = document.createElement('td');
  descTd.textContent = product.description;

  const likesTd = document.createElement('td');
  likesTd.textContent = product.likes || 0;

  img.addEventListener('click', async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: product._id }),
      });

      if (!response.ok) throw new Error('Failed to like product');
      product.likes += 1;
      likesTd.textContent = product.likes;
    } catch (error) {
      console.error('Error liking product:', error);
    }
  });

  imageTd.appendChild(img);
  row.appendChild(nameTd);
  row.appendChild(imageTd);
  row.appendChild(descTd);
  row.appendChild(likesTd);
  tableBody.appendChild(row);
}

async function searchProducts() {
  const name = searchField.value.trim();

  try {
    const response = await fetch(`http://127.0.0.1:5000/search`);
    if (!response.ok) throw new Error('Network response was not ok');

    const products = await response.json();
    clearResults();

    if (products.length === 0) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 4;
      cell.textContent = 'Δεν βρέθηκαν προϊόντα.';
      row.appendChild(cell);
      tableBody.appendChild(row);
    } else {
      products.forEach(createProductRow);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}


searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  searchProducts();
});

window.addEventListener('DOMContentLoaded', () => {
  loadPopularProducts(); // φορτώνει τα δημοφιλή προϊόντα
  searchProducts(); // φορτώνει όλα τα προϊόντα στην αρχή
});

async function loadPopularProducts() {
  try {
    const response = await fetch('http://127.0.0.1:5000/popular-products');
    if (!response.ok) throw new Error('Failed to fetch popular products');

    const products = await response.json();
    const slideshow = document.getElementById('slideshow');
    slideshow.innerHTML = '';

    products.forEach(product => {
      const slide = document.createElement('div');
      slide.className = 'slide';

      let imgPath = product.image;
      if (imgPath && !imgPath.includes(".")) {
        imgPath += ".jpg";
      }

      const img = document.createElement('img');
      img.src = imgPath ? `/static/images/${imgPath}` : "/static/images/placeholder.jpg";
      img.alt = product.name;
      img.style.width = '300px';

      const caption = document.createElement('p');
      caption.textContent = product.name;

      slide.appendChild(img);
      slide.appendChild(caption);
      slideshow.appendChild(slide);
    });

    startSlideshow();
  } catch (error) {
    console.error('Error loading popular products:', error);
  }
}

function startSlideshow() {
  const slides = document.querySelectorAll('#slideshow .slide');
  let currentIndex = 0;

  if (slides.length === 0) return;

  slides.forEach((slide, i) => {
    slide.style.display = i === 0 ? 'block' : 'none';
  });

  setInterval(() => {
    slides[currentIndex].style.display = 'none';
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].style.display = 'block';
  }, 3000);
}

window.addEventListener('DOMContentLoaded', () => {
  loadPopularProducts();
  searchProducts();
});*/

let allProducts = [];

document.addEventListener("DOMContentLoaded", () => {
    fetch("http://127.0.0.1:5000/search")
        .then(response => response.json())
        .then(data => {
            allProducts = data;
            renderProducts(allProducts);
        })
        .catch(error => {
            console.error("Σφάλμα κατά τη λήψη των προϊόντων:", error);
        });
});

function filterProducts() {
    const searchInput = document.getElementById("productSearch").value.toLowerCase();
    const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchInput)
    );
    renderProducts(filtered);
}

function renderProducts(products) {
    const tableBody = document.querySelector("#resultsTable tbody");
    tableBody.innerHTML = "";

    products.forEach(product => {
        const row = document.createElement("tr");

        // Όνομα
        const nameCell = document.createElement("td");
        nameCell.textContent = product.name;
        row.appendChild(nameCell);

        // Εικόνα
        const imageCell = document.createElement("td");
        const img = document.createElement("img");
        img.src = `static/images/${product.image}`; // <-- σωστό πεδίο εδώ
        img.alt = product.name;
        img.width = 100;
        imageCell.appendChild(img);
        row.appendChild(imageCell);

        // Περιγραφή
        const descCell = document.createElement("td");
        descCell.textContent = product.description || "Χωρίς περιγραφή";
        row.appendChild(descCell);

        // Τιμή
        const priceCell = document.createElement("td");
        priceCell.textContent = product.price ? `${product.price}€` : "-";
        row.appendChild(priceCell);

        // Likes
        const likeCell = document.createElement("td");
        likeCell.textContent = product.likes ;
        row.appendChild(likeCell);

        // Κουμπί Like
        const likeButtonCell = document.createElement("td");
        const likeButton = document.createElement("button");
        likeButton.textContent = "💖";
        likeButton.style.cursor = "pointer";

       /* likeButton.addEventListener("click",  () => {
          console.log("Στέλνω ID για like:", product.ID);

            fetch("http://127.0.0.1:5000/like", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ID: product.ID }) // Στέλνουμε το ID του προϊόντος
            })
            .then(response => {
                if (!response.ok) throw new Error("Αποτυχία στο Like");
                return response.json();
            })
            .then(() => {
                // Αύξησε τοπικά το count likes και ενημέρωσε UI
                product.likes = (product.likes || 0) + 1;
                likeCell.textContent = product.likes;
            })
            .catch(err => {
                console.error("Σφάλμα κατά το Like:", err);
            });
        });
        likeButton.addEventListener("click", () => {
    fetch("http://127.0.0.1:5000/like", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ _id: product._id.toString() }) // Στέλνουμε το _id του προϊόντος
    })
    .then(response => {
        if (!response.ok) throw new Error("Αποτυχία στο Like");
        return response.json();
    })
    .then(data => {
        // Χρησιμοποίησε την τιμή likes που επιστρέφει το backend, όχι τοπική αυξηση
        product.likes = data.likes; // Ενημέρωση με την τιμή από το backend
        likeCell.textContent = product.likes;
    })
    .catch(err => {
        console.error("Σφάλμα κατά το Like:", err);
    });
});*/
likeButton.addEventListener('click', async () => {
    try {
      console.log(product._id.toString());
        const response = await fetch('http://127.0.0.1:5000/like', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: product._id }) // Στέλνεις το _id όπως είναι από MongoDB
        });

        if (!response.ok) throw new Error('Failed to like product');

        const data = await response.json();
        product.likes = product.likes+1;   // Ενημέρωση με την τιμή που επέστρεψε το backend
        likeCell.textContent = product.likes;
    } catch (error) {
        console.error('Error liking product:', error);
    }
});





        likeButtonCell.appendChild(likeButton);
        row.appendChild(likeButtonCell);

        tableBody.appendChild(row);
    });
}

