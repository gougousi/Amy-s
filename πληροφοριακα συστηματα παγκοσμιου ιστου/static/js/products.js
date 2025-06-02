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

       
likeButton.addEventListener("click", async () => {
    try {
        console.log("Sending like request for product ID:", product._id);
        
        // Add visual feedback while processing
        likeButton.disabled = true;
        likeButton.textContent = "...";

        const response = await fetch("http://127.0.0.1:5000/like", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify({ id: product._id }),
        });
        
        console.log("Response status:", response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Server error response:", errorText);
            throw new Error(`Failed to like product: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Like response:", data);

        // Update the UI
        product.likes = data.likes;
        likeCell.textContent = product.likes;
        
        // Show success feedback
        likeButton.textContent = "✓";
        setTimeout(() => {
            likeButton.textContent = "💖";
            likeButton.disabled = false;
        }, 1000);
    } catch (error) {
        console.error("Error liking product:", error);
        // Restore button state
        likeButton.textContent = "💖";
        likeButton.disabled = false;
    }
});





        likeButtonCell.appendChild(likeButton);
        row.appendChild(likeButtonCell);

        tableBody.appendChild(row);
    });
}

