async function loadProducts() {
  const container = document.querySelector(".all-products");
  container.innerHTML = "";  // Καθαρίζουμε το container πριν προσθέσουμε προϊόντα

  try {
    const response = await fetch("/api/products");
    if (!response.ok) throw new Error("Network response was not ok");

    const products = await response.json();

    products.forEach(product => {
      // Φτιάχνουμε το HTML για κάθε προϊόν
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");

      // Φτιάχνουμε το path της εικόνας, αν έχει πεδίο images (αν όχι, βάζουμε placeholder)
      const imagePath = product.images ? `static/images/${product.images}` : "static/images/placeholder.jpg";

      productDiv.innerHTML = `
        <img src="${imagePath}" alt="${product.name}" width="200px" data-id="${product.ID || product._id}">
        <h3>${product.name}</h3>
        <p>${product.description || ""}</p>
        <p><strong>Τιμή:</strong> ${product.price || "N/A"}€</p>
      `;

      container.appendChild(productDiv);
    });

  } catch (error) {
    container.innerHTML = "<p>Σφάλμα κατά τη φόρτωση των προϊόντων.</p>";
    console.error("Failed to load products:", error);
  }
}

// Όταν φορτώσει η σελίδα, φορτώνουμε τα προϊόντα
window.addEventListener("DOMContentLoaded", loadProducts);