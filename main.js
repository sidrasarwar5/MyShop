// Currency settings
let currency = localStorage.getItem("currency") || "PKR";
let conversionRate = 280; // 1 USD = 280 PKR

// Product data
const products = [
  { id: 1, name: "Smart Watch", priceUSD: 50, img: "images/product1.jpg", desc: "A smart watch with fitness features." },
  { id: 2, name: "Wireless Earbuds", priceUSD: 30, img: "images/product2.jpg", desc: "Crystal clear sound and compact design." },
  { id: 3, name: "Bluetooth Speaker", priceUSD: 40, img: "images/product4.jpg", desc: "Loud, portable,good quality and waterproof." },
  { id: 4, name: "Fitness Tracker", priceUSD: 35, img: "images/product3.jpg", desc: "Track steps, heart rate, and more." , style: "height = 34px"},
  { id: 1, name: "Smart Watch", priceUSD: 50, img: "images/product5.jpg", desc: "A smart watch with fitness features." },
  { id: 2, name: "Wireless Earbuds", priceUSD: 30, img: "images/product6.jpg", desc: "Crystal clear sound and compact design." },
  { id: 3, name: "Bluetooth Speaker", priceUSD: 40, img: "images/product7.jpg", desc: "Loud, portable,good quality and waterproof." },
  { id: 4, name: "Fitness Tracker", priceUSD: 35, img: "images/product8.jpg", desc: "Track steps, heart rate, and more." },
  { id: 1, name: "Smart Watch", priceUSD: 50, img: "images/product9.jpg", desc: "A smart watch with fitness features." },
  { id: 2, name: "Wireless Earbuds", priceUSD: 30, img: "images/product10.jpg", desc: "Crystal clear sound and compact design." },
  { id: 3, name: "Bluetooth Speaker", priceUSD: 40, img: "images/product11.jpg", desc: "Loud, portable,good quality and waterproof." },
  { id: 4, name: "Fitness Tracker", priceUSD: 35, img: "images/product12.jpg", desc: "Track steps, heart rate, and more."
   
   }
];

// Get cart key based on selected currency
function getCartKey() {
  return `cart_${currency}`;
}

// Render all products
function renderProducts() {
  const container = document.getElementById("product-list");
  if (!container) return;

  container.innerHTML = "";
  products.forEach(product => {
    const price = currency === "PKR" ? product.priceUSD * conversionRate : product.priceUSD;
    const card = `
      <div class="col-md-3 col-6 mb-4">
        <div class="card h-100">
          <img src="${product.img}" class="card-img-top" alt="${product.name}">
          <div class="card-body">
            <h5>${product.name}</h5>
            <p>${product.desc}</p>
            <p>${currency === "PKR" ? "₨" : "$"}${price.toLocaleString()}</p>
            <button class="btn btn-primary w-100" onclick="addToCart(${product.id})">Add to Cart</button>
          </div>
        </div>
      </div>`;
    container.insertAdjacentHTML("beforeend", card);
  });
}

// Add item to cart
function addToCart(id) {
  const cartKey = getCartKey();
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  const index = cart.findIndex(item => item.id === id);

  if (index !== -1) {
    cart[index].qty += 1;
  } else {
    const product = products.find(p => p.id === id);
    cart.push({ ...product, qty: 1 });
  }

  localStorage.setItem(cartKey, JSON.stringify(cart));
  alert("Product added to cart!");
}

// Render cart
function renderCart() {
  const cartKey = getCartKey();
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  const container = document.getElementById("cart-items");
  const totalPriceEl = document.getElementById("totalPrice");

  if (!container || !totalPriceEl) return;

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    totalPriceEl.innerText = `${currency === "PKR" ? "₨" : "$"} 0`;
    return;
  }

  container.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const price = currency === "PKR" ? item.priceUSD * conversionRate : item.priceUSD;
    const subtotal = price * item.qty;
    total += subtotal;

    const itemHTML = `
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div class="d-flex gap-3">
          <img src="${item.img}" width="80" class="img-thumbnail" alt="${item.name}">
          <div>
            <h5>${item.name}</h5>
            <p>${currency === "PKR" ? "₨" : "$"}${subtotal.toLocaleString()} (${item.qty})</p>
          </div>
        </div>
        <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">Remove</button>
      </div>`;
    container.insertAdjacentHTML("beforeend", itemHTML);
  });

  totalPriceEl.innerText = `${currency === "PKR" ? "₨" : "$"} ${total.toLocaleString()}`;
}

// Remove item from cart
function removeFromCart(index) {
  const cartKey = getCartKey();
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  cart.splice(index, 1);
  localStorage.setItem(cartKey, JSON.stringify(cart));
  renderCart();
}

// Clear both carts
function clearCart() {
  localStorage.removeItem("cart_PKR");
  localStorage.removeItem("cart_USD");
  renderCart();
}

// Handle currency toggle
function handleCurrencyToggle() {
  const toggle = document.getElementById("currencyToggle");
  if (!toggle) return;

  toggle.value = currency;

  toggle.addEventListener("change", () => {
    currency = toggle.value;
    localStorage.setItem("currency", currency);
    renderProducts();
    renderCart();
    renderCheckout();
  });
}

// Render checkout total
function renderCheckout() {
  const totalPriceEl = document.getElementById("totalPriceCheckout");
  if (!totalPriceEl) return;

  const cartKey = getCartKey();
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  let total = 0;
  cart.forEach(item => {
    const price = currency === "PKR" ? item.priceUSD * conversionRate : item.priceUSD;
    total += price * item.qty;
  });

  totalPriceEl.innerText = `${currency === "PKR" ? "₨" : "$"} ${total.toLocaleString()}`;
}

// Initialize everything on load
document.addEventListener("DOMContentLoaded", () => {
  handleCurrencyToggle();
  renderProducts();
  renderCart();
  renderCheckout();

  // Clear cart button
  const clearBtn = document.getElementById("clearCart");
  if (clearBtn) {
    clearBtn.addEventListener("click", clearCart);
  }

  // Proceed to checkout button
  const proceedBtn = document.getElementById("proceedToCheckout");
  if (proceedBtn) {
    proceedBtn.addEventListener("click", () => {
      const cartKey = getCartKey();
      const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
      
      if (cart.length === 0) {
        alert("Your cart is empty. Please add some products first.");
        return;
      }
      
      if (currency === "PKR") {
        window.location.href = "pkrCheckout.html";
      } else {
        window.location.href = "usdCheckout.html";
      }
    });
  }

  // Checkout form handling
  const nextStepBtn = document.getElementById("nextStep");
  if (nextStepBtn) {
    nextStepBtn.addEventListener("click", () => {
      const form = document.getElementById("checkoutForm");
      if (form.checkValidity()) {
        document.getElementById("checkout-form").style.display = "none";
        
        if (currency === "PKR") {
          document.getElementById("payment-options").style.display = "block";
        } else {
          document.getElementById("online-payment-form").style.display = "block";
        }
      } else {
        form.reportValidity();
      }
    });
  }

  // COD button handling
  const codBtn = document.getElementById("cod");
  if (codBtn) {
    codBtn.addEventListener("click", () => {
      document.getElementById("payment-options").style.display = "none";
      document.getElementById("cod-confirmation").style.display = "block";
    });
  }

  // Online payment button handling
  const onlineBtn = document.getElementById("online-payment");
  if (onlineBtn) {
    onlineBtn.addEventListener("click", () => {
      document.getElementById("payment-options").style.display = "none";
      document.getElementById("online-payment-form").style.display = "block";
    });
  }

  // Online payment form submission
  const onlinePaymentForm = document.getElementById("onlinePaymentForm");
  if (onlinePaymentForm) {
    onlinePaymentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (onlinePaymentForm.checkValidity()) {
        document.getElementById("online-payment-form").style.display = "none";
        document.getElementById("payment-confirmation").style.display = "block";
      } else {
        onlinePaymentForm.reportValidity();
      }
    });
  }
});
