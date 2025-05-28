document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".product img");

  images.forEach(img => {
    img.addEventListener("click", () => {
      const productId = img.getAttribute("data-id");

      if (!productId) {
        console.error("Missing product ID");
        return;
      }

      fetch("/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ID: parseInt(productId) }) // ή απλό string, αν το ID στη βάση είναι string
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to like product");
        }
        return response.json();
      })
      .then(data => {
        console.log("Like sent!", data);
        alert("💖 Έδωσες like στο προϊόν!");
      })
      .catch(err => {
        console.error("Error:", err);
        alert("⚠️ Κάτι πήγε στραβά.");
      });
    });
  });
});
// This script adds a click event listener to each product image.
// When an image is clicked, it sends a POST request to the server with the product ID.