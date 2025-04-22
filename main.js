// Currency settings
let currency = localStorage.getItem("currency") || "PKR";
let conversionRate = 280; // 1 USD = 280 PKR

// Product data
const products = [
  { id: 1, name: "Red Shirt", priceUSD: 50, img: "images/product1.jpg", desc: "Good fabric with nice design." },
  { id: 2, name: "Earrings", priceUSD: 30, img: "images/product4.jpg", desc: "Good quality with nice design." },
  { id: 3, name: "Shirt", priceUSD: 40, img: "images/product2.jpg", desc: "Good fabric with nice design." },
  { id: 4, name: "Red Mug", priceUSD: 35, img: "images/product3.jpg", desc: "Good quality and durable", style: "height = 34px" },
  { id: 5, name: "Bracelets", priceUSD: 50, img: "images/product5.jpg", desc: "Good quality with nice design." },
  { id: 6, name: "Bracelet", priceUSD: 30, img: "images/product6.jpg", desc: "Good quality with nice design." },
  { id: 7, name: "Shirt", priceUSD: 40, img: "images/product7.jpg", desc: "Good fabric with nice design." },
  { id: 8, name: "Headphone", priceUSD: 35, img: "images/product8.jpg", desc: "Loud, portable,good quality and waterproof." },
  { id: 9, name: "Watch", priceUSD: 50, img: "images/product9.jpg", desc: "A watch with good features." },
  { id: 10, name: "Shirt", priceUSD: 30, img: "images/product10.jpg", desc: "Good fabric with nice design." },
  { id: 11, name: "School bag", priceUSD: 40, img: "images/product11.jpg", desc: "Good quality with nice design." },
  { id: 12, name: "White Mug", priceUSD: 35, img: "images/product12.jpg", desc: "Good quality with nice design." }
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
          <a href="product.html?id=${product.id}" class="text-decoration-none text-dark">
            <img src="${product.img}" class="card-img-top" alt="${product.name}">
            <div class="card-body">
              <h5>${product.name}</h5>
              <p>${product.desc}</p>
              <p>${currency === "PKR" ? "₨" : "$"}${price.toLocaleString()}</p>
            </div>
          </a>
          <div class="card-footer bg-white border-0">
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
  updateCartCount();
  showAddedToCartAlert();
}

// Show "added to cart" alert
function showAddedToCartAlert() {
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert alert-success position-fixed top-0 end-0 m-3';
  alertDiv.style.zIndex = '1000';
  alertDiv.textContent = 'Product added to cart!';
  
  document.body.appendChild(alertDiv);
  
  setTimeout(() => {
    alertDiv.classList.add('fade');
    setTimeout(() => alertDiv.remove(), 300);
  }, 2000);
}

// Update cart count in navbar
function updateCartCount() {
  const cartKey = getCartKey();
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  
  const cartCountElements = document.querySelectorAll('.cart-count');
  cartCountElements.forEach(el => {
    el.textContent = totalItems;
    el.style.display = totalItems > 0 ? 'inline-block' : 'none';
  });
}

// Render cart with quantity controls
function renderCart() {
  const cartKey = getCartKey();
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  const container = document.getElementById("cart-items");
  const totalPriceEl = document.getElementById("totalPrice");

  if (!container || !totalPriceEl) return;

  if (cart.length === 0) {
    container.innerHTML = "<p class='text-muted'>Your cart is empty.</p>";
    totalPriceEl.textContent = `${currency === "PKR" ? "₨" : "$"} 0`;
    document.getElementById("proceedToCheckout").disabled = true;
    return;
  }

  container.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const price = currency === "PKR" ? item.priceUSD * conversionRate : item.priceUSD;
    const subtotal = price * item.qty;
    total += subtotal;

    const itemHTML = `
            <div class="cart-item border rounded p-3 mb-3">
  <div class="row align-items-center">
    
    <!-- Product Image & Info -->
    <div class="col-12 col-md-5 d-flex align-items-center gap-3 mb-3 mb-md-0">
      <img src="${item.img}" width="80" height="80" class="img-thumbnail object-fit-cover" alt="${item.name}">
      <div>
        <h5 class="mb-1">${item.name}</h5>
        <p class="mb-1 text-muted">${currency === "PKR" ? "₨" : "$"}${price.toLocaleString()} each</p>
      </div>
    </div>
    
    <!-- Quantity Control -->
    <div class="col-6 col-md-3 d-flex justify-content-md-center mb-3 mb-md-0">
      <div class="input-group" style="width: 130px;">
        <button class="btn btn-outline-secondary decrement-btn" type="button" data-id="${item.id}">-</button>
        <input type="text" class="form-control text-center quantity-input" value="${item.qty}" data-id="${item.id}" readonly>
        <button class="btn btn-outline-secondary increment-btn" type="button" data-id="${item.id}">+</button>
      </div>
    </div>
    
    <!-- Subtotal -->
    <div class="col-6 col-md-2 text-end mb-3 mb-md-0">
      <strong>${currency === "PKR" ? "₨" : "$"}${subtotal.toLocaleString()}</strong>
    </div>

    <!-- Remove Button -->
    <div class="col-12 col-md-2 text-end">
      <button class="btn remove-btn w-100 w-md-auto text-light" data-id="${item.id}">Remove</button>
    </div>

  </div>
</div>

      `;
    container.insertAdjacentHTML("beforeend", itemHTML);
  });

  totalPriceEl.textContent = `${currency === "PKR" ? "₨" : "$"} ${total.toLocaleString()}`;
  document.getElementById("proceedToCheckout").disabled = false;
  
  // Attach event listeners to the new buttons
  attachCartItemEventListeners();
}

// Attach event listeners to cart item buttons
function attachCartItemEventListeners() {
  // Increment quantity
  document.querySelectorAll('.increment-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      updateCartItemQuantity(id, 1);
    });
  });

  // Decrement quantity
  document.querySelectorAll('.decrement-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      updateCartItemQuantity(id, -1);
    });
  });

  // Remove item
  document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      removeCartItem(id);
    });
  });
}

// Update item quantity in cart with message
function updateCartItemQuantity(id, change) {
  const cartKey = getCartKey();
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  const itemIndex = cart.findIndex(item => item.id === id);

  if (itemIndex !== -1) {
    if (change === -1 && cart[itemIndex].qty <= 1) {
  
      return;
    }
    
    cart[itemIndex].qty += change;
    localStorage.setItem(cartKey, JSON.stringify(cart));
    renderCart();
    updateCartCount();
  }
}

// Remove item from cart
function removeCartItem(id) {
  const cartKey = getCartKey();
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  const updatedCart = cart.filter(item => item.id !== id);
  localStorage.setItem(cartKey, JSON.stringify(updatedCart));
  renderCart();
  updateCartCount();
}

// Clear both carts
function clearCart() {
  localStorage.removeItem("cart_PKR");
  localStorage.removeItem("cart_USD");
  renderCart();
  updateCartCount();
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

  totalPriceEl.textContent = `${currency === "PKR" ? "₨" : "$"} ${total.toLocaleString()}`;
}

// Initialize everything on load
document.addEventListener("DOMContentLoaded", () => {
  handleCurrencyToggle();
  renderProducts();
  renderCart();
  renderCheckout();
  updateCartCount();

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
