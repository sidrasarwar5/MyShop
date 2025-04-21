let currency = localStorage.getItem("currency") || "PKR";
let conversionRate = 280; // 1 USD = 280 PKR

// Product array
const products = [
  { id: 1, name: "Red Shirt", priceUSD: 50, img: "images/product1.jpg", desc: "Good fabric with nice design." },
  { id: 2, name: "Earrings", priceUSD: 30, img: "images/product4.jpg", desc: "Good quality with nice design." },
  { id: 3, name: "Shirt", priceUSD: 40, img: "images/product2.jpg", desc: "Good fabric with nice design." },
  { id: 4, name: "Red Mug", priceUSD: 35, img: "images/product3.jpg", desc: "Good quality and durable" },
  { id: 5, name: "Bracelets", priceUSD: 50, img: "images/product5.jpg", desc: "Good quality with nice design." },
  { id: 6, name: "Bracelet", priceUSD: 30, img: "images/product6.jpg", desc: "Good quality with nice design." },
  { id: 7, name: "Shirt", priceUSD: 40, img: "images/product7.jpg", desc: "Good fabric with nice design." },
  { id: 8, name: "Headphone", priceUSD: 35, img: "images/product8.jpg", desc: "Loud, portable, good quality and waterproof." },
  { id: 9, name: "Watch", priceUSD: 50, img: "images/product9.jpg", desc: "A watch with good features." },
  { id: 10, name: "Shirt", priceUSD: 30, img: "images/product10.jpg", desc: "Good fabric with nice design." },
  { id: 11, name: "School bag", priceUSD: 40, img: "images/product11.jpg", desc: "Good quality with nice design." },
  { id: 12, name: "White Mug", priceUSD: 35, img: "images/product12.jpg", desc: "Good quality with nice design." }
];

const reviews = [
  { name: "Ali Raza", comment: "Really comfortable and stylish! Worth every penny.", rating: 5 },
  { name: "Fatima Khan", comment: "Good quality, but the size was a bit smaller than expected.", rating: 4 },
  { name: "Usman Iqbal", comment: "Fast delivery and great fit. Will buy again!", rating: 5 }
];

function getCartKey() {
  return `cart_${currency}`;
}

// Get product ID from URL params
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get("id"));
const product = products.find(p => p.id === productId);

if (product) {
  const price = currency === "PKR" ? product.priceUSD * conversionRate : product.priceUSD;

  // Update page with product details
  document.getElementById("product-name").innerText = product.name;
  document.getElementById("product-price").innerText = `${currency === "PKR" ? "₨" : "$"}${price.toLocaleString()}`;
  document.getElementById("original-price").innerText = `${currency === "PKR" ? "₨" : "$"}${(price * 1.2).toLocaleString()}`;
  document.getElementById("product-description").innerText = product.desc;
  document.getElementById("product-main-image").src = product.img;

  document.getElementById("product-details-list").innerHTML = `
    <li><strong>Brand:</strong> MyShop</li>
    <li><strong>Material:</strong> Premium Quality</li>
    <li><strong>Return Policy:</strong> 7 Days</li>
  `;

  document.getElementById("review-count").innerText = `(${reviews.length} reviews)`;

  // Show reviews
  const reviewsContainer = document.getElementById("reviews-container");
  reviews.forEach(review => {
    const reviewDiv = document.createElement("div");
    reviewDiv.classList.add("mb-3");
    reviewDiv.innerHTML = `
      <strong>${review.name}</strong>
      <p class="mb-1">${review.comment}</p>
      <small class="text-warning">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</small>
      <hr>
    `;
    reviewsContainer.appendChild(reviewDiv);
  });

  const qtyInput = document.getElementById("product-qty");

  // Increment and decrement quantity
  document.getElementById("increment-qty").addEventListener("click", () => {
    qtyInput.value = parseInt(qtyInput.value) + 1;
  });

  document.getElementById("decrement-qty").addEventListener("click", () => {
    if (parseInt(qtyInput.value) > 1) {
      qtyInput.value = parseInt(qtyInput.value) - 1;
    }
  });

  // Add to cart functionality
  document.getElementById("add-to-cart").addEventListener("click", () => {
    const qty = parseInt(qtyInput.value);
    const cartKey = getCartKey();
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const index = cart.findIndex(item => item.id === product.id);

    if (index !== -1) {
      cart[index].qty += qty;
    } else {
      cart.push({ ...product, qty });
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));
    alert(`${qty} ${product.name}(s) added to cart!`);
  });
} else {
  alert("Product not found!");
}