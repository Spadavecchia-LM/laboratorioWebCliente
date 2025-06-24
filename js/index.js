// Funciones y eventos que interactúan con la UI
import { fetchProducts } from './data.js';
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.10.1/+esm';

let currentProduct = null;

// Detecta contenedores según la página
const cardsContainer = document.querySelector("#card_container") || document.querySelector("#productContainer");
const carrouselContainer = document.querySelector('#carousel-inner');
const checkoutBtn = document.querySelector("#checkout-btn")

// Renderiza productos en cards (para products.html o index si aplica)
async function renderProducts() {
  const products = await fetchProducts();
  if (!cardsContainer) return;

  cardsContainer.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = `
      card custom-card
      p-2 col-6 col-md-3 col-lg-2
      d-flex flex-column align-items-center card-hover
    `;
    card.setAttribute("data-id", product.id);

    card.innerHTML = `
      <img src="${product.image}" class="card-img-top" alt="${product.title}">
      <div class="card-body">
        <h5 class="card-title">${product.title}</h5>
        <p class="card-text text-primary fw-bold text-success">$${product.price}</p>
      </div>
      <div class="w-100">
        <button class="btn btn-outline-primary w-100">Más información</button>
      </div>
    `;

    cardsContainer.appendChild(card);
  });
}

// Renderiza el carrito (sidebar)
function renderCartSidebar() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cart-items");
  const total = document.getElementById("cart-total");

  if (!container || !total) return;

  container.innerHTML = "";

  let finalTotal = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    finalTotal += itemTotal;

    const row = document.createElement("div");
    row.classList.add("d-flex", "align-items-center", "mb-3", "gap-2");

    row.innerHTML = `
      <img src="${item.image}" alt="${item.title}" width="40" height="40" style="object-fit: contain;">
      <div class="flex-grow-1">
        <div class="fw-semibold">${item.title}</div>
        <div class="text-muted small">$${item.price} x ${item.quantity} = $${itemTotal.toFixed(2)}</div>
        <div class="d-flex align-items-center gap-2 mt-1">
          <button class="btn btn-sm btn-outline-secondary" data-action="decrease" data-id="${item.id}" ${item.quantity === 1 ? "disabled" : ""}>-</button>
          <span>${item.quantity}</span>
          <button class="btn btn-sm btn-outline-secondary" data-action="increase" data-id="${item.id}">+</button>
          <button class="btn btn-sm btn-outline-danger ms-auto" data-action="remove" data-id="${item.id}">🗑️</button>
        </div>
      </div>
    `;

    container.appendChild(row);
  });

  total.textContent = `$${finalTotal.toFixed(2)}`;
}

// Renderiza el carrusel (para index.html)
async function renderCarrousel() {
  const productos = await fetchProducts();
  if (!carrouselContainer) return;

  carrouselContainer.innerHTML = '';

  for (let i = 0; i < productos.length; i += 3) {
    const grupo = productos.slice(i, i + 3);

    const slide = document.createElement('div');
    slide.className = 'carousel-item' + (i === 0 ? ' active' : '');

    const row = document.createElement('div');
    row.className = 'row justify-content-center';

    grupo.forEach(producto => {
      const col = document.createElement('div');
      col.className = 'col-md-4 d-flex justify-content-center';

      col.innerHTML = `
        <div class="card" data-id="${producto.id}">
          <img src="${producto.image}" class="card-img-top product-img" alt="${producto.title}">
          <div class="card-body">
            <h5 class="card-title">${producto.title}</h5>
            <p class="card-text fw-bold text-success ">$${producto.price}</p>
          </div>
          <div class="w-100">
        <button class="btn btn-outline-primary w-100 btn-sm">Más información</button>
      </div>
        </div>
      `;

      row.appendChild(col);
    });

    slide.appendChild(row);
    carrouselContainer.appendChild(slide);
  }
}

// Abre modal al hacer clic en una card con data-id
document.addEventListener("click", (e) => {
  const card = e.target.closest(".card[data-id]");
  if (card) {
    const productId = card.getAttribute("data-id");

    fetchProducts().then(products => {
      const product = products.find(p => p.id == productId);
      if (product) {
        currentProduct = product;
        document.getElementById("productModalLabel").innerText = product.title;
        document.getElementById("modal-image").src = product.image;
        document.getElementById("modal-description").innerText = product.description;
        document.getElementById("modal-price").innerText = `$${product.price}`;

        const modal = new bootstrap.Modal(document.getElementById('productModal'));
        modal.show();
      }
    });
  }
});

// Sumar y restar productos
document.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const action = btn.dataset.action;
  const id = parseInt(btn.dataset.id);
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find(p => p.id === id);

  if (!item) return;

  if (action === "increase") item.quantity += 1;
  if (action === "decrease" && item.quantity > 1) item.quantity -= 1;
  if (action === "remove") {
    cart = cart.filter(p => p.id !== id);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCartSidebar();
});

// Vaciar carrito
document.getElementById("clear-cart-btn")?.addEventListener("click", () => {
  localStorage.removeItem("cart");
  updateCartCount();
  renderCartSidebar();
    const sidebarElement = document.getElementById('cartSidebar');
  const sidebarInstance = bootstrap.Offcanvas.getInstance(sidebarElement);
  sidebarInstance.hide();

    Swal.fire({
  
    position: 'bottom-center',
    icon: 'success',
    title: 'El carrito fue vaciado con éxito.',
    showConfirmButton: false,
    timer: 1800,
    timerProgressBar: true
  });
});

// Agrega producto al carrito y actualiza contador
document.getElementById("btn-add-to-cart")?.addEventListener("click", () => {
  if (currentProduct) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find(item => item.id === currentProduct.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: currentProduct.id,
        title: currentProduct.title,
        price: currentProduct.price,
        image: currentProduct.image,
        quantity: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();

    // Cierra el modal
    const modalElement = document.getElementById('productModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();

    // SweetAlert2
   Swal.fire({
  toast: true,
  position: 'bottom-end',
  icon: 'success',
  title: `"${currentProduct.title}" fue agregado al carrito.`,
  showConfirmButton: false,
  timer: 1800,
  timerProgressBar: true,
  customClass: {
    popup: 'colored-toast'
  }
});

  }
});

// Actualiza el número del carrito en la navbar
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const badge = document.getElementById("cart-count");

  if (badge) {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? "inline-block" : "none";
  }
}

// Captura el click del carrito y muestra el sidebar (tambien el del span con la cantidad)
  document.getElementById("cart-button")?.addEventListener("click", () => {
    renderCartSidebar();
    const offcanvas = new bootstrap.Offcanvas(document.getElementById("cartSidebar"));
    offcanvas.show();
  });

checkoutBtn?.addEventListener("click", () => {
  window.location.href = "../pages/checkout.html";
});

// Ejecutar todo cuando carga la página
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCarrousel();
  updateCartCount();
});
