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

